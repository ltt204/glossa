'use client'

import { useEffect, useState } from 'react'
import { CreateWordInput, Word } from '@/lib/words/models'
import { getWords } from '@/lib/words/actions'
import { Card } from '@/components/ui/card'

const LANGUAGES = [
	{ code: 'en', name: 'English' },
	{ code: 'vi', name: 'Vietnamese' },
	{ code: 'es', name: 'Spanish' },
	{ code: 'fr', name: 'French' },
	{ code: 'de', name: 'German' },
	{ code: 'ja', name: 'Japanese' },
	{ code: 'ko', name: 'Korean' },
	{ code: 'zh', name: 'Chinese' },
] as const

const EMPTY_FORM: CreateWordInput = {
	origin: '',
	source: 'en',
	translated: '',
	target: 'vi',
}

export default function WordsPage() {
	const [words, setWords] = useState<Word[]>([])

	useEffect(() => {
		getWords().then((data: Word[]) => {
			setWords(data)
		})
	}, [])

	console.log('data:', words)
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
