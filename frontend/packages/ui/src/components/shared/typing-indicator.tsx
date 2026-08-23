export function TypingIndicator() {
	return (
		<div className="flex items-center gap-1.5 items-smart">
			<span
				className="w-1 h-1 rounded-full bg-primary pulse-dot animate-bounce"
				style={{ animationDelay: '0ms' }}
			/>
			<span
				className="w-1 h-1 rounded-full bg-primary pulse-dot animate-bounce"
				style={{ animationDelay: '200ms' }}
			/>
			<span
				className="w-1 h-1 rounded-full bg-primary pulse-dot animate-bounce"
				style={{ animationDelay: '400ms' }}
			/>
		</div>
	)
}
