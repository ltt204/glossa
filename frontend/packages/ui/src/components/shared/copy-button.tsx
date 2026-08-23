import { useState } from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ textToCopy }: { textToCopy: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (!textToCopy) return

		await navigator.clipboard.writeText(textToCopy)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={handleCopy}
					disabled={!textToCopy}
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
	)
}
