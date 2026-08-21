import { getWords, saveWord, unsaveWord } from '@/lib/words/actions'
import { CreateWordInput, Word } from '@/lib/words/models'
import { create } from 'zustand'

type UseWordStoreProps = {
	words: Word[]
	isFetching: boolean
	isError: boolean
	error: Error | null
	handleUnsave: (id: string) => Promise<void>
	handleSaveWord: (word: CreateWordInput) => Promise<Word | undefined>
	checkIsSaved: (origin: string) => Word | undefined
	setWords: (words: Word[]) => void
	init: () => Promise<void>
}

export const useWordStore = create<UseWordStoreProps>((set, get) => ({
	words: [],
	isFetching: false,
	isError: false,
	error: null,
	handleUnsave: async (id: string) =>
		await unsaveWord(id).then(() =>
			set((prev) => ({
				...prev,
				words: prev.words.filter((word) => word.id !== id),
			})),
		),
	handleSaveWord: async (word: CreateWordInput) => {
		const result = await saveWord(word)
		if (result) {
			set((prev) => ({ ...prev, words: [...prev.words, result] }))
			return result
		}
		return undefined
	},
	checkIsSaved: (origin: string): Word | undefined =>
		get().words.find((word: Word) => word.origin === origin),
	setWords: (words: Word[]) => set((prev) => ({ ...prev, words })),
	init: async () => {
		set((prev) => ({ ...prev, isFetching: true }))
		try {
			const words = await getWords()
			set((prev) => ({ ...prev, words }))
		} catch (error) {
			set((prev) => ({ ...prev, isError: true, error: error as Error }))
		} finally {
			set((prev) => ({ ...prev, isFetching: false }))
		}
	},
}))
