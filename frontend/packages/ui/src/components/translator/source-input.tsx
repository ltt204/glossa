import { Textarea } from '../ui/textarea'
import TypingIndicator from '../shared/typing-indicator'
import SpeakButton from '../shared/speak-button'
import ClearButton from '../shared/clear-button'
import {
	useTranslator,
	useTranslateStore,
} from '@/app/(app)/translate/hooks/use-translator'
import { useCollapsableSidebarStore } from '@/hooks/use-collapsable-sidebar'
import DefinitionSidebarTitle from './definition-sidebar-title'
import DefinitionSidebarContent from './definition-sidebar-content'
import StateComponent from '../shared/state-component'

export default function SourceInput() {
	const {
		sourceText,
		setSourceText,
		sourceLang,

		handleClear,
	} = useTranslateStore()

	const { isError, isLoading, error, wordMeanings, phonetic, detectedLang } =
		useTranslator()

	if (isError) {
		return (
			<StateComponent
				message={error?.message ?? 'Error occurred while fetching data'}
			/>
		)
	}

	const { openSidebar } = useCollapsableSidebarStore()
	const charCount = sourceText.length

	const setSidebarOpen = () => {
		openSidebar(
			{
				title: sourceText,
				props: {
					sourceLang,
					detectedLang,
					partOfSpeech: wordMeanings[0].partOfSpeech,
				},
				titleComponent: DefinitionSidebarTitle,
			},
			{
				payload: wordMeanings,
				contentComponent: DefinitionSidebarContent,
			},
		)
	}

	return (
		<div className="flex-1 flex flex-col px-3 py-2 min-h-0 border-2 border-solid rounded-md mx-4">
			<div className="relative flex-1">
				<Textarea
					value={sourceText}
					onChange={(e) => setSourceText(e.target.value)}
					placeholder="Type or paste text..."
					className="min-h-8 rounded-none resize-none border-none bg-transparent px-0 py-0 focus:outline-none text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
				/>
				{sourceText.trim() !== '' && phonetic && (
					<p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
						{phonetic}
					</p>
				)}

				{isLoading ? (
					<TypingIndicator />
				) : sourceText.trim() !== '' && wordMeanings?.length !== 0 ? (
					<div className="flex flex-row gap-2">
						<div className="flex items-center gap-2">
							<p className="text-sm leading-relaxed text-muted-foreground">
								{wordMeanings[0].partOfSpeech}
							</p>
							{wordMeanings.length > 1 && (
								<p className="text-sm leading-relaxed text-muted-foreground">
									+ {wordMeanings.length - 1} more
								</p>
							)}
							<a
								className="text-sm leading-relaxed text-primary cursor-pointer hover:underline"
								onClick={setSidebarOpen}
							>
								{wordMeanings.length === 1
									? "See word's definitions"
									: "See words' definitions"}
							</a>
						</div>
					</div>
				) : (
					sourceText.trim() !== '' &&
					wordMeanings.length === 0 && (
						<p className="text-sm leading-relaxed text-muted-foreground">
							No definition found
						</p>
					)
				)}
			</div>
			<div className="flex flex-1 items-center justify-between pt-1">
				<div className="flex items-center gap-1">
					<SpeakButton
						sourceLang={sourceLang}
						detectedLang={detectedLang}
						sourceText={sourceText}
					/>
					<ClearButton sourceText={sourceText} handleClear={handleClear} />
				</div>
				<span className="text-[10px] tabular-nums text-muted-foreground/60">
					{charCount > 0 && `${charCount}`}
				</span>
			</div>
		</div>
	)
}
