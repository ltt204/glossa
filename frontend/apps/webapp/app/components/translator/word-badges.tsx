import { Badge, Label } from '@glossa/ui'
import { useState } from 'react'

export function WordBadges({
	payload,
	label,
}: {
	payload: string[]
	label: string
}) {
	const [showAll, setShowAll] = useState(false)
	return (
		<div className="flex flex-wrap gap-2 mt-2">
			<Label className="text-sm mr-2">{label}:</Label>
			{showAll || payload.length <= 8 ? (
				payload.map((word, idx) => <Badge key={idx}>{word}</Badge>)
			) : (
				<>
					{payload.slice(0, 8).map((word, idx) => (
						<Badge key={idx}>{word}</Badge>
					))}
					<p
						onClick={() => setShowAll(true)}
						className="text-primary text-sm px-2 rounded-md hover:cursor-pointer hover:underline"
					>
						{' '}
						+ {payload.length - 8} more
					</p>
				</>
			)}
		</div>
	)
}
