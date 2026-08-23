'use client'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	return (
		<div className="flex justify-center items-center mesh-bg">
			<div className="frost-panel w-full rounded-xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden p-4">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-heading font-semibold tracking-tight">
						Oops! Something went wrong
					</h2>
				</div>
				<p className="text-muted-foreground">
					Don't worry, our team has been notified.
				</p>
				<details>
					<summary>Error Details (for developers)</summary>
					<pre>{error.message}</pre>
				</details>
				<button onClick={reset} className="retry-button">
					Try Again
				</button>
			</div>
		</div>
	)
}
