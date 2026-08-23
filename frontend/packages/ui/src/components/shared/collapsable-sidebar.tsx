import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useCollapsableSidebarStore } from '@glossa/core'

interface CollapsibleSidebarProps {
	isOpen: boolean
	onClose: () => void
	width?: number // Configurable width, defaults to 360
}

export default function CollapsableSidebar({
	isOpen,
	onClose,
	width = 360,
}: CollapsibleSidebarProps) {
	const { titlePayload, contentPayload } = useCollapsableSidebarStore()

	if (!titlePayload || !contentPayload) {
		return null
	}

	return (
		<div
			className={`
				transition-[width,opacity] duration 300 ease-in-out flex-shrink-0
				border-l border-primary/20 shadow-sm bg-background overflow-hidden
				rounded-md ml-4
				${isOpen ? 'opacity-100' : 'opacity-0 border-l-0'}
			`}
			style={{
				width: isOpen ? `${width}px` : '0',
			}}
		>
			<aside className="flex flex-col h-full">
				{/* Inner Container */}
				<div className="flex flex-col items-center px-4 pt-4 pb-2 h-full gap-2">
					{/* Abstract Header */}
					<div className="flex flex-row items-baselinpe justify-between w-full">
						{titlePayload.titleComponent && (
							<titlePayload.titleComponent
								title={titlePayload.title}
								props={titlePayload.props}
							/>
						)}
						<Button
							className="w-8 h-8 bg-transparent hover:bg-primary/20"
							onClick={onClose}
						>
							<X className="w-4 h-4 text-primary" />
						</Button>
					</div>

					{/* Abstract Content */}
					{contentPayload.contentComponent && (
						<contentPayload.contentComponent payload={contentPayload.payload} />
					)}
				</div>
			</aside>
		</div>
	)
}
