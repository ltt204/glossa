import { Badge } from '../ui/badge'
import { ArrowRight, Star } from 'lucide-react'
import SpeakButton from '../shared/speak-button'
import { Button } from '../ui/button'
import { Item, ItemActions, ItemContent, ItemDescription } from '../ui/item'
import { useWordStore } from '@/app/(app)/words/hooks/useWord'

export default function WordsList() {
	const { words, handleUnsave } = useWordStore()
	return (
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
						<div>
							<div className="flex flex-row gap-2">
								<span className="text-primary text-sm">{word.origin}</span>
								<SpeakButton
									sourceLang={word.sourceLang}
									sourceText={word.origin}
								/>
							</div>
							<div className="flex flex-row gap-2">
								<span className="text-primary text-sm italic">
									{word.translated}
								</span>
								<SpeakButton
									sourceLang={word.targetLang}
									sourceText={word.translated}
								/>
							</div>
						</div>
					</ItemContent>
					<ItemActions>
						<Button
							variant="ghost"
							className="w-6 h-6 rounded-full cursor-pointer"
							onClick={() => handleUnsave(word.id)}
						>
							<Star
								fill={word.isSaved ? 'gold' : 'currentColor'}
								className={`w-4 h-4 cursor-pointer ${word.isSaved ? 'text-transparent' : 'text-gray-400'}`}
							/>
						</Button>
					</ItemActions>
				</Item>
			))}
		</div>
	)
}
