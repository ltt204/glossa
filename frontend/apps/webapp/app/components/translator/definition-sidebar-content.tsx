import type { Definition, Meaning } from '@glossa/core'
import { DefinitionItem } from './definition-item'
import { ContentPayloadProps } from '@/app/hooks'

export function DefinitionSidebarContent({ payload }: ContentPayloadProps) {
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
