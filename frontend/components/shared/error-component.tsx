import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface ErrorComponentProps {
	message: string
	illustration?: React.ReactNode
	subMessage?: string
	buttonText?: string
	className?: string
	reset: () => void
}

export default function ErrorComponent({
	message,
	illustration,
	subMessage,
	buttonText,
	className,
	reset,
}: ErrorComponentProps) {
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

			{reset && buttonText && <Button onClick={reset}>{buttonText}</Button>}
		</div>
	)
}
