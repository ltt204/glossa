import TypingIndicator from '../shared/typing-indicator'
import { Textarea } from '../ui/textarea'
import SpeakButton from '../shared/SpeakButton'
import CopyButton from '../shared/CopyButton'

export default function TranslationOutput({
	isTranslating,
	sourceText,
	translatedText,
	targetLang,
}: {
	isTranslating: boolean
	sourceText: string
	translatedText: string
	targetLang: string
}) {
	return (
		<div className="flex-1 flex flex-col px-3 py-2 min-h-0 rounded-md border-2 border-solid mx-4">
			<div className="flex-1">
				{sourceText.trim() !== '' && isTranslating ? (
					<TypingIndicator />
				) : (
					<Textarea
						value={translatedText}
						disabled
						placeholder="Translation will appear here..."
						className="disabled:opacity-100 disabled:cursor-default min-h-8 rounded-none resize-none border-none bg-transparent px-0 py-0 focus:outline-none text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
					/>
				)}
			</div>
			<div className="flex items-center gap-1 pt-1">
				<SpeakButton
					sourceLang={targetLang}
					detectedLang={targetLang}
					sourceText={translatedText}
				/>
				<CopyButton textToCopy={translatedText} />
			</div>
		</div>
	)
}
