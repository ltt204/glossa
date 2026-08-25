import {
	Button,
	CopyButton,
	SpeakButton,
	Textarea,
	TypingIndicator,
} from '@glossa/ui'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Word } from '@glossa/core'
import { useTranslateStore, useTranslator, useWordStore } from '@/app/hooks'

export function TranslationOutput() {
	const { checkIsSaved, handleUnsave, handleSaveWord } = useWordStore()
	const [savedWord, setSavedWord] = useState<Word>()
	const { sourceText, sourceLang, targetLang } = useTranslateStore()
	const { isError, isLoading, error, translatedText } = useTranslator()

	useEffect(() => {
		const savedWord = checkIsSaved(sourceText)
		if (savedWord) {
			setSavedWord(savedWord)
		}
	}, [sourceText])

	return (
		<div className="flex-1 flex flex-col px-3 py-2 min-h-0 rounded-md border-2 border-solid mx-4">
			<div className="flex-1">
				{sourceText.trim() !== '' && isLoading ? (
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
