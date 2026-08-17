import TypingIndicator from '../shared/typing-indicator'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Copy, Check, Volume2 } from 'lucide-react'
import { Textarea } from '../ui/textarea'

export default function TranslationOutput({
	isTranslating,
	sourceText,
	translatedText,
	targetLang,
	handleSpeak,
	handleCopy,
	copied,
}: {
	isTranslating: boolean
	sourceText: string
	translatedText: string
	targetLang: string
	handleSpeak: (text: string, lang: string) => void
	handleCopy: () => void
	copied: boolean
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
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon-xs"
							onClick={() => handleSpeak(translatedText, targetLang)}
							disabled={!translatedText}
							className=" text-muted-foreground hover:text-primary hover:bg-primary/10"
						>
							<Volume2 className="w-3.5 h-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Listen</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon-xs"
							onClick={handleCopy}
							disabled={!translatedText}
							className=" text-muted-foreground hover:text-primary hover:bg-primary/10"
						>
							{copied ? (
								<Check className="w-3.5 h-3.5 text-primary" />
							) : (
								<Copy className="w-3.5 h-3.5" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}
