import { Volume2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function SpeakButton({
	sourceText,
	sourceLang,
	detectedLang,
}: {
	sourceText: string
	sourceLang: string
	detectedLang?: string
}) {
	const handleSpeak = (text: string, lang: string) => {
		if (!text || !window.speechSynthesis) return
		window.speechSynthesis.cancel()
		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = lang
		utterance.rate = 0.9
		window.speechSynthesis.speak(utterance)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={() =>
						handleSpeak(
							sourceText,
							sourceLang === 'auto' ? detectedLang || 'en' : sourceLang,
						)
					}
					disabled={!sourceText}
					className="text-muted-foreground hover:text-primary hover:bg-primary/10"
				>
					<Volume2 className="w-3.5 h-3.5" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>Listen</TooltipContent>
		</Tooltip>
	)
}
