'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	ArrowRightLeft,
	Copy,
	Check,
	Volume2,
	Eraser,
	Languages,
} from 'lucide-react'
import Link from 'next/link'
import * as models from '@/lib/translate/models'
import useDebounce from '@/app/(app)/translate/hooks/useDebounce'
import TypingIndicator from './shared/typing-indicator'
import { translate } from '@/lib/translate/actions'

const LANGUAGES = [
	{ code: 'en', name: 'English', flag: 'EN' },
	{ code: 'vi', name: 'Vietnamese', flag: 'VI' },
	{ code: 'es', name: 'Spanish', flag: 'ES' },
	{ code: 'fr', name: 'French', flag: 'FR' },
	{ code: 'de', name: 'German', flag: 'DE' },
	{ code: 'ja', name: 'Japanese', flag: 'JA' },
	{ code: 'ko', name: 'Korean', flag: 'KO' },
	{ code: 'zh', name: 'Chinese', flag: 'ZH' },
	{ code: 'th', name: 'Thai', flag: 'TH' },
	{ code: 'pt', name: 'Portuguese', flag: 'PT' },
	{ code: 'ru', name: 'Russian', flag: 'RU' },
	{ code: 'ar', name: 'Arabic', flag: 'AR' },
] as const

export function Translator() {
	const [sourceText, setSourceText] = useState('')
	const [phonetic, setPhonetic] = useState('')
	const [translatedText, setTranslatedText] = useState('')
	const [sourceLang, setSourceLang] = useState('auto')
	const [targetLang, setTargetLang] = useState('vi')
	const [wordMeanings, setWordMeanings] = useState<models.Meaning[]>([])
	const [isTranslating, setIsTranslating] = useState(false)
	const [copied, setCopied] = useState(false)
	const [detectedLang, setDetectedLang] = useState<string | null>(null)
	const debouncedSourceText = useDebounce(sourceText)

	useEffect(() => {
		if (debouncedSourceText.trim() === '') return

		const controller = new AbortController()
		const { signal } = controller
		const fetchData = async () => {
			setIsTranslating(true)
			const response = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: debouncedSourceText, target: targetLang }),
				signal,
			})

			if (!response.ok) {
				throw new Error('Translation failed')
			}

			const res = await response.json()
			if (!res.success || !res.content) {
				throw new Error(res.message || 'Translation failed')
			}

			const data: models.TranslateResult = res.content

			setTranslatedText(
				data.translations
					.map((translation: models.Translate) => {
						return translation.translatedText
					})
					.join(', '),
			)

			if (data.definitions && data.definitions.length > 0) {
				const phonetics = data.definitions[0].phonetics.filter(
					(phonetic) => phonetic.text !== '',
				)
				setPhonetic(phonetics[0]?.text || '')
				setWordMeanings(data.definitions[0].meanings)
			} else {
				setPhonetic('')
				setWordMeanings([])
			}

			if (data.translations && data.translations.length > 0) {
				setDetectedLang(data.translations[0].detectedLanguageCode || '')
			}
			setIsTranslating(false)
		}
		fetchData().catch((err) => {
			if (err.name !== 'AbortError') {
				console.error(err)
			} else {
				console.log('Fetching aborted')
			}
		})

		return () => {
			controller.abort()
		}
	}, [targetLang, debouncedSourceText])

	const setEmpty = () => {
		setPhonetic('')
		setTranslatedText('')
		setDetectedLang(null)
		setWordMeanings([])
	}

	// TODO: Handle Abort Signal for changing target language
	const handleTargetChange = (lang: string) => {
		setTargetLang(lang)
		if (sourceText.trim()) translate(sourceText, lang)
	}

	// TODO: Handle Abort Signal for swapping languages
	const handleSwap = () => {
		if (sourceLang === 'auto' || !translatedText) return
		const prevSource = sourceLang
		const prevTarget = targetLang
		const prevTranslated = translatedText

		setSourceLang(prevTarget)
		setTargetLang(prevSource)
		setSourceText(prevTranslated)
		setEmpty()
		translate(prevTranslated, prevSource)
	}

	const handleCopy = async () => {
		if (!translatedText) return
		await navigator.clipboard.writeText(translatedText)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	const handleSpeak = (text: string, lang: string) => {
		if (!text || !window.speechSynthesis) return
		window.speechSynthesis.cancel()
		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = lang
		utterance.rate = 0.9
		window.speechSynthesis.speak(utterance)
	}

	const handleClear = () => {
		setSourceText('')
		setEmpty()
	}

	const charCount = sourceText.length
	const detectedName =
		detectedLang && sourceLang === 'auto'
			? LANGUAGES.find((l) => l.code === detectedLang)?.name
			: null

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<header className="flex items-center justify-between px-5 py-4">
				<div className="flex items-center gap-2.5">
					<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
						<Languages className="w-4 h-4 text-primary" />
					</div>
					<h1 className="text-lg font-heading font-semibold tracking-tight">
						Glossa
					</h1>
				</div>
			</header>

			{/* Language selector bar */}
			<div className="flex items-center gap-2 px-5 pb-3">
				<Select value={sourceLang} onValueChange={setSourceLang}>
					<SelectTrigger className="flex-1 h-9 text-xs font-medium">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="auto">
							<span className="text-muted-foreground">Auto</span>
							{detectedName && (
								<span className="ml-1 text-primary text-[10px]">
									({detectedName})
								</span>
							)}
						</SelectItem>
						{LANGUAGES.map((lang) => (
							<SelectItem key={lang.code} value={lang.code}>
								<span className="mr-1.5 text-[10px] font-semibold text-muted-foreground/70">
									{lang.flag}
								</span>
								{lang.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={handleSwap}
							disabled={sourceLang === 'auto'}
							className="rounded-xl shrink-0 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30"
						>
							<ArrowRightLeft className="w-3.5 h-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Swap languages</TooltipContent>
				</Tooltip>

				<Select value={targetLang} onValueChange={handleTargetChange}>
					<SelectTrigger className="flex-1 h-9 text-xs font-medium">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LANGUAGES.map((lang) => (
							<SelectItem key={lang.code} value={lang.code}>
								<span className="mr-1.5 text-[10px] font-semibold text-muted-foreground/70">
									{lang.flag}
								</span>
								{lang.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex-1 flex flex-col md:flex-row gap-4">
				{/* Source input */}
				<div className="flex-1 flex flex-col px-5 pt-2 pb-2 min-h-0 gap-2 border-2 border-solid mx-8 rounded-md">
					<div className="relative flex-1">
						<Textarea
							value={sourceText}
							onChange={(e) => setSourceText(e.target.value)}
							placeholder="Type or paste text..."
							className="min-h-8 rounded-none resize-none border-none bg-transparent px-0 py-0 focus:outline-none text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
						/>
						{sourceText.trim() !== '' && phonetic && (
							<p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
								{phonetic}
							</p>
						)}

						{sourceText.trim() !== '' && wordMeanings.length === 1 ? (
							<div className="flex flex-row gap-2">
								{wordMeanings.map((meaning) => (
									<div
										key={meaning.partOfSpeech}
										className="flex items-center gap-2"
									>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{meaning.partOfSpeech}
										</p>
									</div>
								))}
								<a
									// TODO: Handle open side panel and show definitions
									onClick={() => console.log('Show side panel')}
									className="text-sm leading-relaxed text-primary"
								>
									See word's definitions
								</a>
							</div>
						) : sourceText.trim() !== '' && wordMeanings.length > 1 ? (
							<div className="flex flex-row gap-2">
								<div className="flex items-center gap-2">
									<p className="text-sm leading-relaxed text-muted-foreground">
										{wordMeanings[0].partOfSpeech} + {wordMeanings.length - 1}{' '}
										more
									</p>
								</div>
								<a
									// TODO: Handle open side panel and show definitions
									onClick={() => console.log('Show side panel')}
									className="text-sm leading-relaxed text-primary font-medium text-fg-brand hover:underline cursor-pointer"
								>
									See word's definitions
								</a>
							</div>
						) : (
							sourceText.trim() !== '' &&
							wordMeanings.length === 0 && (
								<p className="text-sm leading-relaxed text-muted-foreground">
									No definition found
								</p>
							)
						)}
					</div>
					<div className="flex flex-1 items-center justify-between pt-1">
						<div className="flex items-center gap-1">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon-xs"
										onClick={() =>
											handleSpeak(
												sourceText,
												sourceLang === 'auto'
													? detectedLang || 'en'
													: sourceLang,
											)
										}
										disabled={!sourceText}
										className="text-muted-foreground hover:text-primary hover:bg-primary/10"
									>
										<Volume2 className="w-3.5 h-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Listen</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon-xs"
										onClick={handleClear}
										disabled={!sourceText}
										className=" text-muted-foreground hover:text-destructive hover:bg-destructive/10"
									>
										<Eraser className="w-3.5 h-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Clear</TooltipContent>
							</Tooltip>
						</div>
						<span className="text-[10px] tabular-nums text-muted-foreground/60">
							{charCount > 0 && `${charCount}`}
						</span>
					</div>
				</div>

				{/* Result divider */}
				{/* <div className="mx-5 flex items-center gap-3">
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
					<div
						className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
							isTranslating ? 'bg-primary animate-pulse' : 'bg-border'
						}`}
					/>
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
				</div> */}

				{/* Translation output */}
				<div className="flex-1 flex flex-col px-5 pt-3 pb-2 min-h-0 rounded-md border-2 border-solid mx-8">
					<div className="flex-1">
						{sourceText.trim() !== '' && isTranslating ? (
							<TypingIndicator />
						) : sourceText.trim() !== '' && translatedText ? (
							<p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
								{translatedText}
							</p>
						) : (
							<p className="leading-relaxed text-muted-foreground/40 italic">
								Translation will appear here...
							</p>
						)}
					</div>
					<div className="flex items-center gap-1 pt-1">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() => handleSpeak(translatedText, targetLang)}
									disabled={!translatedText}
									className=" text-muted-foreground hover:text-primary hover:bg-primary/10"
								>
									<Volume2 className="w-3.5 h-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Listen</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={handleCopy}
									disabled={!translatedText}
									className=" text-muted-foreground hover:text-primary hover:bg-primary/10"
								>
									{copied ? (
										<Check className="w-3.5 h-3.5 text-primary" />
									) : (
										<Copy className="w-3.5 h-3.5" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="px-5 py-3 text-center">
				<p className="text-[10px] text-muted-foreground/40">
					Powered by Google Cloud Translation
				</p>
			</footer>
		</div>
	)
}
