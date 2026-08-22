'use client'
import { Languages } from 'lucide-react'
import LanguageSelectorBar from './translator/language-selector-bar'
import SourceInput from './translator/source-input'
import TranslationOutput from './translator/translation-output'
import { useCollapsableSidebarStore } from '@/hooks/use-collapsable-sidebar'
import DefinitionSidebarTitle from './translator/definition-sidebar-title'
import DefinitionSidebarContent from './translator/definition-sidebar-content'
import { useTranslateStore } from '@/app/(app)/translate/hooks/use-translator'

export function Translator() {
	const { openSidebar } = useCollapsableSidebarStore()

	const {
		detectedLang,
		targetLang,
		setTargetLang,

		sourceLang,
		setSourceLang,

		handleSwap,
	} = useTranslateStore()

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
				<SourceInput />
				{/* Translation output */}
				<TranslationOutput />
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
