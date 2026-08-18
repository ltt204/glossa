import useDebounce from '@/app/hooks/useDebounce'
import {
	Translate,
	TranslateResult,
	TranslateResultSchema,
} from '@/lib/translate/models'
import { abort } from 'process'
import { useEffect, useRef, useState } from 'react'

export default function useTranslator() {
	const [isTranslating, setIsTranslating] = useState(false)
	const [sourceText, setSourceText] = useState('')
	const [targetLang, setTargetLang] = useState('vi')
	const [sourceLang, setSourceLang] = useState('auto')

	const handleSwap = () => {
		if (sourceLang === 'auto' || !translatedText) return
		const prevSource = sourceLang
		const prevTarget = targetLang
		const prevTranslated = translatedText

		setSourceLang(prevTarget)
		setTargetLang(prevSource)
		setSourceText(prevTranslated)
	}

	const handleClear = () => {
		setSourceText('')
		setTranslatedResult(null)
	}

	const debouncedSourceText = useDebounce(sourceText)
	const [translatedResult, setTranslatedResult] =
		useState<TranslateResult | null>(null)

	const abortControllerRef = useRef<AbortController | null>(null)

	useEffect(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}

		if (debouncedSourceText.trim() === '') {
			setIsTranslating(false)
			setTranslatedResult(null)
			return
		}

		const controller = new AbortController()
		abortControllerRef.current = controller
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
				console.log(`Resposne is not ok: ${response}`)
				setIsTranslating(false)
				throw new Error('Translation failed')
			}

			const res = await response.json()
			const parseResponse = TranslateResultSchema.safeParse(res.content)

			const data = parseResponse.data
			if (!data || data.translations.length === 0) {
				setIsTranslating(false)
				throw new Error('Translation not found')
			}

			setTranslatedResult(data)
			setIsTranslating(false)
		}
		fetchData().catch((err) => {
			if (err.name !== 'AbortError') {
				console.error(err)
			} else {
				console.log('Fetching aborted')
			}
		})
	}, [targetLang, debouncedSourceText])

	if (!translatedResult) {
		return {
			isTranslating,
			translatedText: '',
			detectedLang: '',
			wordMeanings: [],
			phonetic: '',
			sourceText,
			setSourceText,
			targetLang,
			setTargetLang,
			sourceLang,
			setSourceLang,

			handleSwap,
			handleClear,
		}
	}

	const translatedText =
		translatedResult.translations
			.map((translation: Translate) => {
				return translation.translatedText
			})
			.join(', ') || ''

	const detectedLang = translatedResult.translations[0].detectedLanguageCode

	const firstDefinition = translatedResult.definitions[0]
	const wordMeanings = firstDefinition?.meanings || []
	const phonetic =
		firstDefinition?.phonetics.filter((phonetic) => phonetic.text !== '')[0]
			?.text || ''

	// TODO: return also list of definition for displaying within the drawer
	return {
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

		handleSwap,
		handleClear,
	}
}
