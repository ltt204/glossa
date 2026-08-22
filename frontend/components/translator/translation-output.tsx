import TypingIndicator from '../shared/typing-indicator'
import { Textarea } from '../ui/textarea'
import SpeakButton from '../shared/speak-button'
import CopyButton from '../shared/copy-button'
import { Button } from '../ui/button'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Word } from '@/lib/words/models'
import { useWordStore } from '@/app/(app)/words/hooks/use-word'
import { useTranslateStore } from '@/app/(app)/translate/hooks/use-translator'

export default function TranslationOutput() {
	const { checkIsSaved, handleUnsave, handleSaveWord } = useWordStore()
	const [savedWord, setSavedWord] = useState<Word>()
	const {
		isTranslating,
		isError,
		error,
		sourceLang,
		sourceText,
		translatedText,
		targetLang,
	} = useTranslateStore()

	useEffect(() => {
		const savedWord = checkIsSaved(sourceText)
		if (savedWord) {
			setSavedWord(savedWord)
		}
	}, [sourceText])

	return (
		<div className="flex-1 flex flex-col px-3 py-2 min-h-0 rounded-md border-2 border-solid mx-4">
			<div className="flex-1">
				{sourceText.trim() !== '' && isTranslating ? (
					<TypingIndicator />
				) : (
					<div className="flex flex-row">
						<Textarea
							value={!isError ? translatedText : error?.message}
							disabled
							placeholder={
								isError ? 'Error' : 'Translation will appear here...'
							}
							className={`${
								isError ? 'text-red-400 font-semibold italic' : 'text-primary'
							} disabled:opacity-100 disabled:cursor-default min-h-8 rounded-none resize-none border-none bg-transparent px-0 py-0 focus:outline-none text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent`}
						/>
						{!isError && (
							<Button
								variant="secondary"
								onClick={async () => {
									if (savedWord) {
										handleUnsave(savedWord.id)
										setSavedWord(undefined)
									} else {
										setSavedWord(
											await handleSaveWord({
												origin: sourceText,
												source: sourceLang,
												translated: translatedText,
												target: targetLang,
											}),
										)
									}
								}}
								className="h-8 w-8 rounded-full bg-transparent hover:bg-primary/10 hover:cursor-pointer"
							>
								<Star
									fill={`${savedWord ? 'gold' : 'none'}`}
									className={`w-4 h-4 cursor-pointer ${savedWord ? 'text-transparent' : 'text-gray-400'}`}
								/>
							</Button>
						)}
					</div>
				)}
			</div>
			<div className="flex items-center gap-1 pt-1">
				<SpeakButton
					sourceLang={targetLang}
					detectedLang={targetLang}
					sourceText={translatedText}
				/>
				<CopyButton textToCopy={translatedText} />
			</div>
		</div>
	)
}
