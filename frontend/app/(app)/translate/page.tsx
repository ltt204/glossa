'use client'

import { Translator } from '@/components/translator'
import CollapsableSidebar from '@/components/shared/collapsable-sidebar'
import { useCollapsableSidebarStore } from '@/hooks/use-collapsable-sidebar'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import WordsList from '@/components/words/words-sidebar-content'
import WordsSidebarTitle from '@/components/words/words-sidebar-title'
import { useEffect } from 'react'
import { useWordStore } from '../words/hooks/use-word'

export default function Home() {
	const { isOpen, openSidebar, closeSidebar } = useCollapsableSidebarStore()
	const { words, init } = useWordStore()

	console.log('words', words)

	useEffect(() => {
		console.log('init')
		init()
	}, [init])

	return (
		<div className="flex flex-row flex-1 mesh-bg min-h-screen p-4 sm:p-8">
			<div className="flex flex-col flex-1 items-center">
				<div className="h-16"></div>
				<div className="frost-panel w-full rounded-xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden">
					<Translator />
				</div>
				<Button
					className="w-12 h-12 rounded-full bg-primary/80 mt-12"
					onClick={() => {
						if (isOpen) {
							closeSidebar()
							return
						}

						openSidebar(
							{
								title: 'Saved words',
								titleComponent: WordsSidebarTitle,
							},
							{
								contentComponent: WordsList,
							},
						)
					}}
				>
					<Star />
				</Button>
			</div>
			<CollapsableSidebar isOpen={isOpen} onClose={closeSidebar} />
		</div>
	)
}
