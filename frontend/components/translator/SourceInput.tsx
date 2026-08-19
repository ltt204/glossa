import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eraser } from 'lucide-react'
import TypingIndicator from '../shared/typing-indicator'
import { Meaning } from '@/lib/translate/models'
import { useState } from 'react'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import DefinitionItem from './DefinitionItem.'
import SpeakButton from '../shared/SpeakButton'
import ClearButton from '../shared/ClearButton'

export default function SourceInput({
	sourceText,
	setSourceText,
	phonetic,
	isTranslating,
	wordMeanings,
	charCount,
	handleClear,
	detectedLang,
	sourceLang,
	setSidebarOpen,
}: {
	sourceText: string
	setSourceText: (text: string) => void
	phonetic: string
	isTranslating: boolean
	wordMeanings: Meaning[]
	charCount: number
	handleClear: () => void
	detectedLang: string
	sourceLang: string
	setSidebarOpen: () => void
}) {
	return (
		<div className="flex-1 flex flex-col px-3 py-2 min-h-0 border-2 border-solid rounded-md mx-4">
			<div className="relative flex-1">
				<Textarea
					value={sourceText}
					onChange={(e) => setSourceText(e.target.value)}
					placeholder="Type or paste text..."
					className="min-h-8 rounded-none resize-none border-none bg-transparent px-0 py-0 focus:outline-none text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
				/>
				{sourceText.trim() !== '' && phonetic && (
					<p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
						{phonetic}
					</p>
				)}

				{isTranslating ? (
					<TypingIndicator />
				) : sourceText.trim() !== '' && wordMeanings?.length !== 0 ? (
					<div className="flex flex-row gap-2">
						<div className="flex items-center gap-2">
							<p className="text-sm leading-relaxed text-muted-foreground">
								{wordMeanings[0].partOfSpeech}
							</p>
							{wordMeanings.length > 1 && (
								<p className="text-sm leading-relaxed text-muted-foreground">
									+ {wordMeanings.length - 1} more
								</p>
							)}
							<a
								className="text-sm leading-relaxed text-primary cursor-pointer hover:underline"
								onClick={setSidebarOpen}
							>
								{wordMeanings.length === 1
									? "See word's definitions"
									: "See words' definitions"}
							</a>
						</div>
					</div>
				) : (
					sourceText.trim() !== '' &&
					wordMeanings.length === 0 && (
						<p className="text-sm leading-relaxed text-muted-foreground">
							No definition found
						</p>
					)
				)}
			</div>
			<div className="flex flex-1 items-center justify-between pt-1">
				<div className="flex items-center gap-1">
					<SpeakButton
						sourceLang={sourceLang}
						detectedLang={detectedLang}
						sourceText={sourceText}
					/>
					<ClearButton sourceText={sourceText} handleClear={handleClear} />
				</div>
				<span className="text-[10px] tabular-nums text-muted-foreground/60">
					{charCount > 0 && `${charCount}`}
				</span>
			</div>
		</div>
	)
}
