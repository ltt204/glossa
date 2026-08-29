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
					<div className="flex flex-wrap gap-2 mt-2">
						<Label className="text-sm mr-2">Synonyms:</Label>
						{showAllSym || definition.synonyms.length <= 8 ? (
							definition.synonyms.map((synonym, idx) => (
								<Badge key={idx}>{synonym}</Badge>
							))
						) : (
							<>
								{definition.synonyms.slice(0, 8).map((synonym, idx) => (
									<Badge key={idx}>{synonym}</Badge>
								))}
								<p
									onClick={() => setShowAllSym(true)}
									className="text-primary text-sm px-2 rounded-md hover:cursor-pointer hover:underline"
								>
									{' '}
									+ {definition.synonyms.length - 8} more
								</p>
							</>
						)}
					</div>
					<div className="flex flex-wrap gap-2 mt-2">
						<Label className="text-sm mr-2">Antonyms:</Label>
						{showAllAnt || definition.antonyms.length <= 8 ? (
							definition.antonyms.map((antonym, idx) => (
								<Badge key={idx}>{antonym}</Badge>
							))
						) : (
							<>
								{definition.antonyms.slice(0, 8).map((antonym, idx) => (
									<Badge key={idx}>{antonym}</Badge>
								))}
								<p
									onClick={() => setShowAllAnt(true)}
									className="text-primary text-sm px-2 rounded-md hover:cursor-pointer hover:underline"
								>
									{' '}
									+ {definition.antonyms.length - 8} more
								</p>
							</>
						)}
					</div>
				</FieldContent>
			</Field>
		</div>
	)
}
