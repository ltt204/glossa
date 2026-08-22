interface ErrorComponentProps {
	error: Error
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
	return (
		<div>
			<h1>{error.message}</h1>
		</div>
	)
}
