import { Translator } from '@/components/translator'

export default function Home() {
	return (
		<div className="flex flex-col flex-1 mesh-bg min-h-screen p-4 sm:p-8 gap-12">
			<div className="h-16"></div>
			<div className="frost-panel w-full rounded-xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden">
				<Translator />
			</div>
		</div>
	)
}
