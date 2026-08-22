
export default function WordError({
	error,
	resetErrorBoundary,
	className,
}: {
	error: Error
	resetErrorBoundary: () => void
	className?: string
}) {
	return (
		<StateComponent
			className={className}
			message="Oops, something went wrong!"
			subMessage={error.message}
			buttonText="Try again"
			reset={() => resetErrorBoundary()}
		/>
	)
}
