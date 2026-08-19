import { useState } from 'react'

interface openSidebarProps {
	title: React.ReactNode
	children: React.ReactNode
}

export default function useCollapsableSidebar() {
	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState<React.ReactNode>()
	const [children, setChildren] = useState<React.ReactNode>()

	const handleClose = () => {
		setOpen(false)
	}

	const handleToggle = () => {
		setOpen(!open)
	}

	const openSidebar = ({ title, children }: openSidebarProps) => {
		setOpen(true)
		setTitle(title)
		setChildren(children)
	}

	return { open, title, children, openSidebar, handleClose, handleToggle }
}
