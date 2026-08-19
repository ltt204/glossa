'use client'

import { Translator } from '@/components/translator'
import useTranslator from './hooks/useTranslator'
import CollapsableSidebar from '@/components/translator/CollapsableSidebar'
import SpeakButton from '@/components/shared/SpeakButton'
import DefinitionItem from '@/components/translator/DefinitionItem.'
import { DrawerDescription } from '@/components/ui/drawer'
import useWord from '../words/hooks/useWord'
import useCollapsableSidebar from '@/hooks/useCollapsableSidebar'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight, MoreHorizontal, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
} from '@/components/ui/item'

export default function Home() {
	const { open, title, children, openSidebar, handleClose } =
		useCollapsableSidebar()
	const { words } = useWord()

	return (
		<div className="flex flex-row flex-1 mesh-bg min-h-screen p-4 sm:p-8">
			<div className="flex flex-col flex-1 items-center">
				<div className="h-16"></div>
				<div className="frost-panel w-full rounded-xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden">
					<Translator setSidebarOpen={openSidebar} />
				</div>
				<Button
					className="w-12 h-12 rounded-full bg-primary/80 mt-12"
					onClick={() =>
						openSidebar({
							title: <h2>Saved Words</h2>,
							children: (
								<div>
									{words.map((word, index) => (
										<Item
											className="flex flex-row mb-2 py-1 gap-2 border-2 border-primary/20 items-start rounded-sm"
											key={index}
										>
											<ItemContent className="flex flex-col gap-2">
												<ItemDescription className="flex flex-row gap-2 items-center">
													<Badge variant="outline">
														{word.sourceLang}
														<ArrowRight className="w-4 h-4 text-primary" />
														{word.targetLang}
													</Badge>
												</ItemDescription>
												<ItemDescription className="flex flex-row gap-2 items-center">
													<span className="text-primary text-sm">
														{word.origin}
													</span>
													<ArrowRight className="w-3 h-3 text-primary" />
													<span className="text-primary text-sm">
														{word.translated}
													</span>
												</ItemDescription>
											</ItemContent>
											<ItemActions>
												<SpeakButton
													sourceLang={word.sourceLang}
													sourceText={word.origin}
												/>
											</ItemActions>
										</Item>
									))}
								</div>
							),
						})
					}
				>
					<Star />
				</Button>
			</div>
			<CollapsableSidebar
				isOpen={open}
				onClose={handleClose}
				title={title}
				children={children}
			/>
		</div>
	)
}
