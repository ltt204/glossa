'use client'
import { Languages } from 'lucide-react'
import useTranslator from '@/app/(app)/translate/hooks/useTranslator'
import LanguageSelectorBar from './translator/language-selector-bar'
import SourceInput from './translator/source-input'
import TranslationOutput from './translator/translation-output'
import { useCollapsableSidebarStore } from '@/hooks/use-collapsable-sidebar'

export function Translator() {
	// const { isOpen, openSidebar, closeSidebar } = useCollapsableSidebarStore()

	const {
		isTranslating,
		translatedText,
		detectedLang,
		wordMeanings,
		phonetic,
		sourceText,
		setSourceText,
		targetLang,
		setTargetLang,

		sourceLang,
		setSourceLang,

		handleClear,
		handleSwap,
	} = useTranslator()

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<header className="flex items-center justify-between px-5 py-4">
				<div className="flex items-center gap-2.5">
					<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
						<Languages className="w-4 h-4 text-primary" />
					</div>
					<h1 className="text-lg font-heading font-semibold tracking-tight">
						Glossa
					</h1>
				</div>
			</header>

			{/* Language selector bar */}
			<LanguageSelectorBar
				sourceLang={sourceLang}
				setSourceLang={setSourceLang}
				targetLang={targetLang}
				setTargetLang={setTargetLang}
				handleSwap={handleSwap}
				detectedLang={detectedLang}
			/>

			<div className="flex-1 flex flex-col md:flex-row gap-4">
				{/* Source input */}
				<SourceInput
					sourceText={sourceText}
					setSourceText={setSourceText}
					phonetic={phonetic || ''}
					isTranslating={isTranslating}
					wordMeanings={wordMeanings}
					charCount={sourceText.length}
					handleClear={handleClear}
					detectedLang={detectedLang}
					sourceLang={sourceLang}
					setSidebarOpen={() =>
						// setSidebarOpen({
						// 	title: (
						// 		<div className="flex flex-col gap-2">
						// 			<div className="flex flex-row gap-2">
						// 				{sourceText}
						// 				<SpeakButton
						// 					sourceLang={sourceLang}
						// 					detectedLang={detectedLang}
						// 					sourceText={sourceText}
						// 				/>
						// 			</div>
						// 			{wordMeanings.length === 1 && (
						// 				<DrawerDescription>
						// 					{wordMeanings[0].partOfSpeech}
						// 				</DrawerDescription>
						// 			)}
						// 		</div>
						// 	),
						// 	children: (
						// 		<div>
						// 			{wordMeanings.map((meaning, index) => (
						// 				<div key={index}>
						// 					{meaning.definitions.map((definition, index) => (
						// 						<DefinitionItem
						// 							key={index}
						// 							partOfSpeech={meaning.partOfSpeech}
						// 							definition={definition}
						// 						/>
						// 					))}
						// 				</div>
						// 			))}
						// 		</div>
						// 	),
						// })
						{}
					}
				/>
				{/* Translation output */}
				<TranslationOutput
					isTranslating={isTranslating}
					sourceLang={sourceLang}
					sourceText={sourceText}
					translatedText={translatedText}
					targetLang={targetLang}
				/>
			</div>

			{/* Footer */}
			<footer className="px-5 py-3 text-center">
				<p className="text-[10px] text-muted-foreground/40">
					Powered by Google Cloud Translation
				</p>
			</footer>
		</div>
	)
}
