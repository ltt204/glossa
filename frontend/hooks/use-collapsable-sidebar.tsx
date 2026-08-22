import { create } from 'zustand'

export interface TitlePayloadProps {
	title: string
	props?: Record<string, any>
	titleComponent: React.ElementType
}

export interface ContentPayloadProps {
	payload?: Record<string, any>
	contentComponent: React.ElementType
}

interface CollapsableSidebarProps {
	isOpen: boolean
	titlePayload: TitlePayloadProps | null
	contentPayload: ContentPayloadProps | null
	// Actions
	openSidebar: (
		titlePayload: TitlePayloadProps,
		contentPayload: ContentPayloadProps,
	) => void
	closeSidebar: () => void
	toggleSidebar: () => void
}

export const useCollapsableSidebarStore = create<CollapsableSidebarProps>(
	(set) => ({
		isOpen: false,
		titlePayload: null,
		contentPayload: null,
		openSidebar: (
			titlePayload: TitlePayloadProps,
			contentPayload: ContentPayloadProps,
		) => {
			set({
				isOpen: true,
				titlePayload,
				contentPayload,
			})
		},
		closeSidebar: () => set({ isOpen: false }),
		toggleSidebar: () => set({ isOpen: !useCollapsableSidebarStore().isOpen }),
	}),
)
