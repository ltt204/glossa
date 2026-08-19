import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'

interface CollapsibleSidebarProps {
	isOpen: boolean
	onClose: () => void
	title?: React.ReactNode // Optional title for the header
	width?: number // Configurable width, defaults to 360
	children: React.ReactNode
}

export default function CollapsableSidebar({
	isOpen,
	onClose,
	width = 360,
	title,
	children,
}: CollapsibleSidebarProps) {
	return (
		<div
			className={`
				transition-[width,opacity] duration 300 ease-in-out flex-shrink-0
				border-l border-primary/20 shadow-sm bg-background overflow-hidden
				rounded-md ml-12
				${isOpen ? 'opacity-100' : 'opacity-0 border-l-0'}
			`}
			style={{
				width: isOpen ? `${width}px` : '0',
			}}
		>
			<aside className="flex flex-col h-full">
				{/* Inner Container */}
				<div className="flex flex-col items-center justify-between pt-4 pb-2">
					{/* Abstract Header */}
					<div className="flex flex-row items-baseline justify-between w-full px-4">
						{title}
						<Button
							className="w-8 h-8 bg-transparent hover:bg-primary/20"
							onClick={onClose}
						>
							<X className="w-4 h-4 text-primary" />
						</Button>
					</div>

					{/* Abstract Content */}
					<ScrollArea className="max-h-[calc(100vh-10rem)] px-4 py-2">
						{children}
					</ScrollArea>
				</div>
			</aside>
		</div>
	)
}
