import { Definition, Meaning } from '@/lib/translate/models'
import DefinitionItem from './definition-item'
import { ContentPayloadProps } from '@/hooks/use-collapsable-sidebar'

export default function DefinitionSidebarContent({
	payload,
}: ContentPayloadProps) {
	return (
		<div>
			{payload!.map((meaning: Meaning, index: number) => (
				<div key={index}>
					{meaning.definitions.map((definition: Definition, index: number) => (
						<DefinitionItem
							key={index}
							partOfSpeech={meaning.partOfSpeech}
							definition={definition}
						/>
					))}
				</div>
			))}
		</div>
	)
}
