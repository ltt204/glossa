import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { useCollapsableSidebarStore } from '@/hooks/use-collapsable-sidebar'

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
	const {
		titlePayload: title,
		contentPayload: payload,
		ChildrenComponent,
		TitleComponent,
	} = useCollapsableSidebarStore()

	return (
		<div
			className={`
				transition-[width,opacity] duration 300 ease-in-out flex-shrink-0
				border-l border-primary/20 shadow-sm bg-background overflow-hidden
				rounded-md
				${isOpen ? 'opacity-100' : 'opacity-0 border-l-0'}
			`}
			style={{
				width: isOpen ? `${width}px` : '0',
			}}
		>
			<aside className="flex flex-col h-full">
				{/* Inner Container */}
				<div className="flex flex-col items-center px-4 pt-4 pb-2 h-full">
					{/* Abstract Header */}
					<div className="flex flex-row items-baselinpe justify-between w-full">
						{TitleComponent && <TitleComponent title={title} />}
						<Button
							className="w-8 h-8 bg-transparent hover:bg-primary/20"
							onClick={onClose}
						>
							<X className="w-4 h-4 text-primary" />
						</Button>
					</div>

					{/* Abstract Content */}
					<ScrollArea className="flex-1 max-h-[calc(100vh-8rem)] px-4 py-2 w-full">
						{ChildrenComponent && <ChildrenComponent payload={payload} />}
					</ScrollArea>
				</div>
			</aside>
		</div>
	)
}
