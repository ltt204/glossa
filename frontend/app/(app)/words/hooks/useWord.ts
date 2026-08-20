import { getWords, saveWord, unsaveWord } from '@/lib/words/actions'
import { CreateWordInput, Word } from '@/lib/words/models'
import { useEffect } from 'react'
import { create } from 'zustand'

type UseWordStoreProps = {
	words: Word[]
	handleUnsave: (id: string) => Promise<void>
	handleSaveWord: (word: CreateWordInput) => Promise<Word | undefined>
	checkIsSaved: (origin: string) => Word | undefined
	setWords: (words: Word[]) => void
	init: () => Promise<void>
}

export const useWordStore = create<UseWordStoreProps>((set) => ({
	words: [],
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
		useWordStore.getState().words.find((word: Word) => word.origin === origin),
	setWords: (words: Word[]) => set((prev) => ({ ...prev, words })),
	init: async () => {
		const words = await getWords()
		set((prev) => ({ ...prev, words }))
	},
}))
