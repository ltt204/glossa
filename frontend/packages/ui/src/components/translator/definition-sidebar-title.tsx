import type { TitlePayloadProps } from '@glossa/core'
import { SpeakButton } from '../shared/speak-button'

export interface DefinitionTitlePayloadProps extends TitlePayloadProps {
	props: {
		sourceLang: string
		detectedLang: string
		partOfSpeech: string
	}
}

export function DefinitionSidebarTitle({
	title,
	props,
}: DefinitionTitlePayloadProps) {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row gap-2">
				{title}
				<SpeakButton
					sourceLang={props.sourceLang}
					detectedLang={props.detectedLang}
					sourceText={title}
				/>
			</div>
			{props.partOfSpeech && (
				<p className="text-sm text-primary italic">{props.partOfSpeech}</p>
			)}
		</div>
	)
}
