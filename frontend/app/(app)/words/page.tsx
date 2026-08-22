'use client'

import { useEffect, useState } from 'react'
import { Word } from '@/lib/words/models'
import { getWords } from '@/lib/words/actions'
import { Card } from '@/components/ui/card'

export default function WordsPage() {
	const [words, setWords] = useState<Word[]>([])

	useEffect(() => {
		getWords().then((data: Word[]) => {
			setWords(data)
		})
	}, [])

	return (
		<div className="p-4">
			{words && words.length > 0 ? (
				words.map((word) => (
					<Card key={word.id} className="flex flex-row p-2">
						<div>{word.origin}</div>
						<div>{word.translated}</div>
					</Card>
				))
			) : (
				<div>No words found</div>
			)}
		</div>
	)
}
