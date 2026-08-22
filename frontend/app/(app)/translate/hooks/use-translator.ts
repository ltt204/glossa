import {
	Meaning,
	Translate,
	TranslateResult,
	TranslateResultSchema,
} from '@/lib/translate/models'
import { create } from 'zustand'
import debounce from 'lodash.debounce'
import { DebouncedFunc } from 'lodash-es'

type UseTranslateStoreProps = {
	isTranslating: boolean
	isError: boolean
	error: Error | null

	translatedResult: TranslateResult | null
	translatedText: string
	detectedLang: string
	wordMeanings: Meaning[]
	phonetic: string
	abortController: AbortController | null

	sourceText: string
	setSourceText: (text: string) => void

	targetLang: string
	setTargetLang: (lang: string) => void

	sourceLang: string
	setSourceLang: (lang: string) => void

	handleSwap: () => void
	handleClear: () => void
	translate: DebouncedFunc<
		(text: string, signal?: AbortSignal) => Promise<void>
	>
}

export const useTranslateStore = create<UseTranslateStoreProps>((set, get) => ({
	isTranslating: false,
	isError: false,
	error: null,

	translatedResult: null,
	translatedText: '',
	detectedLang: '',
	wordMeanings: [],
	phonetic: '',

	abortController: null,

	sourceText: '',
	setSourceText: (text: string) => {
		set({ sourceText: text })
		get().translate(text)
	},

	targetLang: 'vi',
	setTargetLang: (lang: string) => {
		set({ targetLang: lang })
		get().translate(get().sourceText)
	},

	sourceLang: 'auto',
	setSourceLang: (lang: string) => {
		set({ sourceLang: lang })
		get().translate(get().sourceText)
	},

	handleSwap: () => {
		set((prev) => {
			return {
				sourceLang: prev.targetLang,
				targetLang: prev.sourceLang,
				sourceText: prev.translatedText,
			}
		})

		get().translate(get().sourceText)
	},
	handleClear: () => {
		set({
			sourceText: '',
			translatedText: '',
			detectedLang: '',
			wordMeanings: [],
			phonetic: '',
		})
	},
	translate: debounce(async (text: string): Promise<void> => {
		if (get().abortController) {
			get().abortController!.abort()
		}

		const controller = new AbortController()

		set({
			abortController: controller,
		})
		const { signal } = controller

		if (text.trim() === '') {
			useTranslateStore.setState({ isTranslating: false })
			return
		}

		const fetchData = async () => {
			useTranslateStore.setState({ isTranslating: true })
			const response = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: text,
					target: get().targetLang,
				}),
				signal,
			})

			if (!response.ok) {
				useTranslateStore.setState({ isTranslating: false })
				throw new Error('Translation failed')
			}

			const res = await response.json()
			const parseResponse = TranslateResultSchema.safeParse(res.content)

			const data = parseResponse.data
			if (!data || data.translations.length === 0) {
				useTranslateStore.setState({ isTranslating: false })
				throw new Error('Translation not found')
			}

			set((prev) => ({
				...prev,
				isTranslating: false,
				translatedResult: data,
			}))
		}

		await fetchData().catch((err) => {
			if (err.name !== 'AbortError') {
				set((prev) => ({
					...prev,
					isError: true,
					error: err,
					isTranslating: false,
				}))
			}
		})

		if (!get().translatedResult) {
			console.error('No translated result found')
			return
		}

		const translatedResult = get().translatedResult!

		set({
			translatedText:
				translatedResult.translations
					.map((translation: Translate) => {
						return translation.translatedText
					})
					.join(', ') || '',
		})

		set({
			detectedLang: translatedResult.translations[0].detectedLanguageCode,
		})

		const firstDefinition = translatedResult.definitions[0]
		set({
			wordMeanings: firstDefinition?.meanings || [],
		})

		set({
			phonetic:
				firstDefinition?.phonetics.filter((phonetic) => phonetic.text !== '')[0]
					?.text || '',
		})
	}, 500),
}))
