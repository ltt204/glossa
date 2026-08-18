import { Definition } from '@/lib/translate/models'
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from '../ui/field'
import { Badge } from '../ui/badge'

export default function DefinitionItem({
	partOfSpeech,
	definition,
}: {
	partOfSpeech: string
	definition: Definition
}) {
	return (
		<FieldLabel className="mb-2">
			<Field className="p-0" orientation="horizontal">
				<FieldContent>
					<FieldTitle className="text-primary">{partOfSpeech}</FieldTitle>
					<FieldDescription>{definition.definition}</FieldDescription>
					{definition.example && (
						<FieldDescription className="text-xs italic">
							{definition.example}
						</FieldDescription>
					)}
					<div className="flex flex-wrap gap-2 mt-2">
						{definition.synonyms.map((synonym, idx) => (
							<Badge key={idx}>{synonym}</Badge>
						))}
					</div>
				</FieldContent>
			</Field>
		</FieldLabel>
	)
}
