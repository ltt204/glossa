import { create } from 'zustand'

interface CollapsableSidebarProps {
	isOpen: boolean
	titlePayload: string
	contentPayload: Record<string, any> | null
	TitleComponent: React.ElementType | null
	ChildrenComponent: React.ElementType | null
	// Actions
	openSidebar: (
		title: string,
		contentPayload: Record<string, any>,
		titleComponent: React.ElementType,
		childrenComponent: React.ElementType,
	) => void
	closeSidebar: () => void
	toggleSidebar: () => void
}

export const useCollapsableSidebarStore = create<CollapsableSidebarProps>(
	(set) => ({
		isOpen: false,
		titlePayload: '',
		contentPayload: {},
		TitleComponent: null,
		ChildrenComponent: null,
		openSidebar: (
			title: string,
			contentPayload: Record<string, any>,
			titleComponent: React.ElementType,
			childrenComponent: React.ElementType,
		) =>
			set({
				isOpen: true,
				titlePayload: title,
				contentPayload: contentPayload,
				TitleComponent: titleComponent,
				ChildrenComponent: childrenComponent,
			}),
		closeSidebar: () => set({ isOpen: false }),
		toggleSidebar: () => set({ isOpen: !useCollapsableSidebarStore().isOpen }),
	}),
)
