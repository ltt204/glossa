'use client'

import type { Definition } from '@glossa/core'
import {
	Badge,
	Field,
	FieldContent,
	FieldDescription,
	FieldTitle,
	Label,
} from '@glossa/ui'
import { useState } from 'react'
import { WordBadges } from './word-badges'

export function DefinitionItem({
	partOfSpeech,
	definition,
}: {
	partOfSpeech: string
	definition: Definition
}) {
	const [showAllSym, setShowAllSym] = useState(false)
	const [showAllAnt, setShowAllAnt] = useState(false)
	return (
		<div className="mb-2 rounded-md px-4 py-2 border-2 border-primary/20">
			<Field orientation="horizontal">
				<FieldContent>
					<FieldTitle className="text-primary">{partOfSpeech}</FieldTitle>
					<FieldDescription>{definition.definition}</FieldDescription>
					{definition.example && (
						<FieldDescription className="text-xs italic">
							{definition.example}
						</FieldDescription>
					)}
					<WordBadges payload={definition.synonyms} label="Synonyms" />
					<WordBadges payload={definition.antonyms} label="Antonyms" />
				</FieldContent>
			</Field>
		</div>
	)
}
