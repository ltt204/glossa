import { getWords } from '@/lib/words/actions'
import { Word } from '@/lib/words/models'
import { useState, useEffect } from 'react'

export default function useWord() {
	const [words, setWords] = useState<Word[]>([])

	useEffect(() => {
		getWords().then((data: Word[]) => {
			setWords(data)
		})
	}, [])

	return {
		words,
		setWords,
	}
}
