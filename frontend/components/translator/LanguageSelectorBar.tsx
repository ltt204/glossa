import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ArrowRightLeft } from 'lucide-react'

const LANGUAGES = [
	{ code: 'en', name: 'English', flag: 'EN' },
	{ code: 'vi', name: 'Vietnamese', flag: 'VI' },
	{ code: 'es', name: 'Spanish', flag: 'ES' },
	{ code: 'fr', name: 'French', flag: 'FR' },
	{ code: 'de', name: 'German', flag: 'DE' },
	{ code: 'ja', name: 'Japanese', flag: 'JA' },
	{ code: 'ko', name: 'Korean', flag: 'KO' },
	{ code: 'zh', name: 'Chinese', flag: 'ZH' },
	{ code: 'th', name: 'Thai', flag: 'TH' },
	{ code: 'pt', name: 'Portuguese', flag: 'PT' },
	{ code: 'ru', name: 'Russian', flag: 'RU' },
	{ code: 'ar', name: 'Arabic', flag: 'AR' },
] as const

export default function LanguageSelectorBar({
	sourceLang,
	setSourceLang,
	targetLang,
	setTargetLang,
	handleSwap,
	detectedLang,
}: {
	sourceLang: string
	setSourceLang: (lang: string) => void
	targetLang: string
	setTargetLang: (lang: string) => void
	handleSwap: () => void
	detectedLang: string | null
}) {
	const detectedName =
		LANGUAGES.find((l) => l.code === detectedLang)?.name || detectedLang

	return (
		<div className="flex items-center gap-2 px-5 pb-3">
			<Select
				value={sourceLang}
				onValueChange={(newLang) => setSourceLang(newLang)}
			>
				<SelectTrigger className="flex-1 h-9 text-xs font-medium">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="auto">
						<span className="text-muted-foreground">Auto</span>
						<span className="ml-1 text-primary text-[10px]">
							{detectedName}
						</span>
					</SelectItem>
					{LANGUAGES.map((lang) => (
						<SelectItem key={lang.code} value={lang.code}>
							<span className="mr-1.5 text-[10px] font-semibold text-muted-foreground/70">
								{lang.flag}
							</span>
							{lang.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={handleSwap}
						disabled={sourceLang === 'auto'}
						className="rounded-xl shrink-0 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30"
					>
						<ArrowRightLeft className="w-3.5 h-3.5" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Swap languages</TooltipContent>
			</Tooltip>

			<Select
				value={targetLang}
				onValueChange={(newLang) => setTargetLang(newLang)}
			>
				<SelectTrigger className="flex-1 h-9 text-xs font-medium">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{LANGUAGES.map((lang) => (
						<SelectItem key={lang.code} value={lang.code}>
							<span className="mr-1.5 text-[10px] font-semibold text-muted-foreground/70">
								{lang.flag}
							</span>
							{lang.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
