'use client'
import { Languages } from 'lucide-react'
import useTranslator from '@/app/(app)/translate/hooks/useTranslator'
import LanguageSelectorBar from './translator/LanguageSelectorBar'
import SourceInput from './translator/SourceInput'
import TranslationOutput from './translator/TranslationOutput'

export function Translator() {
	const {
		isTranslating,
		translatedText,
		detectedLang,
		wordMeanings,
		phonetic,
		sourceText,
		setSourceText,
		targetLang,
		setTargetLang,

		sourceLang,
		setSourceLang,

		handleClear,
		handleSwap,
	} = useTranslator()

	const charCount = sourceText.length
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
			<LanguageSelectorBar
				sourceLang={sourceLang}
				setSourceLang={setSourceLang}
				targetLang={targetLang}
				setTargetLang={setTargetLang}
				handleSwap={handleSwap}
				detectedLang={detectedLang}
			/>

			<div className="flex-1 flex flex-col md:flex-row gap-4">
				{/* Source input */}
				<SourceInput
					sourceText={sourceText}
					setSourceText={setSourceText}
					phonetic={phonetic || ''}
					isTranslating={isTranslating}
					wordMeanings={wordMeanings}
					charCount={charCount}
					handleClear={handleClear}
					detectedLang={detectedLang}
					sourceLang={sourceLang}
				/>
				{/* Translation output */}
				<TranslationOutput
					isTranslating={isTranslating}
					sourceText={sourceText}
					translatedText={translatedText}
					targetLang={targetLang}
				/>
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
