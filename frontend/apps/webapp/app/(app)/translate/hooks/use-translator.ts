import {
	Meaning,
	Translate,
	TranslateResult,
	TranslateResultSchema,
} from '@/lib/translate/models'
import { create } from 'zustand'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '@/app/hooks/use-debounce'

type UseTranslateStoreProps = {
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
}

export const useTranslateStore = create<UseTranslateStoreProps>((set, get) => ({
	translatedResult: null,
	translatedText: '',
	detectedLang: '',
	wordMeanings: [],
	phonetic: '',

	abortController: null,

	sourceText: '',
	setSourceText: (text: string) => {
		set({ sourceText: text })
	},

	targetLang: 'vi',
	setTargetLang: (lang: string) => {
		set({ targetLang: lang })
	},

	sourceLang: 'auto',
	setSourceLang: (lang: string) => {
		set({ sourceLang: lang })
	},

	handleSwap: () => {
		set((prev) => {
			return {
				sourceLang: prev.targetLang,
				targetLang: prev.sourceLang,
				sourceText: prev.translatedText,
			}
		})
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
}))

export function useTranslator() {
	const { sourceText, sourceLang, targetLang } = useTranslateStore()

	const debouncedSourceText = useDebounce(sourceText, 500)

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['translate', debouncedSourceText, sourceLang, targetLang],
		queryFn: async ({ signal }: { signal?: AbortSignal }) => {
			const response = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: debouncedSourceText,
					target: targetLang,
				}),
				signal,
			})

			const res = await response.json()
			const parseResponse = TranslateResultSchema.safeParse(res.content)

			const data = parseResponse.data
			if (!data || data.translations.length === 0) {
				throw new Error('Translation not found')
			}

			return data
		},
		enabled: !!debouncedSourceText && debouncedSourceText.trim() !== '',
	})

	if (!data) {
		return {
			isError,
			isLoading,
			error,

			wordMeanings: [],
			phonetic: '',
			detectedLang: '',
			translatedText: '',
		}
	}

	const translatedText =
		data.translations
			?.map((translation: Translate) => {
				return translation.translatedText
			})
			.join(', ') || ''

	const detectedLang = data.translations?.[0]?.detectedLanguageCode

	const firstDefinition = data.definitions?.[0]
	const wordMeanings = firstDefinition?.meanings || []

	const phonetic =
		firstDefinition?.phonetics.filter((phonetic) => phonetic.text !== '')[0]
			?.text || ''

	return {
		isError,
		isLoading,
		error,

		wordMeanings,
		phonetic,
		detectedLang,
		translatedText,
	}
}
