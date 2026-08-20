import { TitlePayloadProps } from '@/hooks/use-collapsable-sidebar'
import SpeakButton from '../shared/speak-button'
import { DrawerDescription } from '../ui/drawer'

export interface DefinitionTitlePayloadProps extends TitlePayloadProps {
	props: {
		sourceLang: string
		detectedLang: string
		partOfSpeech: string
	}
}

export default function DefinitionSidebarTitle({
	title,
	props,
}: DefinitionTitlePayloadProps) {
	console.log('title', title)
	console.log('props', JSON.stringify(props, null, 2))
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
