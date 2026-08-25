'use client'

import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

interface StateComponentProps {
	message: string
	illustration?: React.ReactNode
	subMessage?: string
	className?: string
	reset?: () => void
	buttonTextContent?: string
}

export function StateComponent({
	message,
	illustration,
	subMessage,
	className,
	reset,
	buttonTextContent,
}: StateComponentProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-2',
				className,
			)}
		>
			{illustration}
			<h1 className="text-lg font-heading font-semibold tracking-tight">
				{message}
			</h1>

			{subMessage && (
				<p className="text-sm text-muted-foreground">{subMessage}</p>
			)}

			{reset && <Button onClick={reset}>{buttonTextContent}</Button>}
		</div>
	)
}
