import { Eraser } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function ClearButton({
	sourceText,
	handleClear,
}: {
	sourceText: string
	handleClear: () => void
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={handleClear}
					disabled={!sourceText}
					className=" text-muted-foreground hover:text-destructive hover:bg-destructive/10"
				>
					<Eraser className="w-3.5 h-3.5" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>Clear</TooltipContent>
		</Tooltip>
	)
}
