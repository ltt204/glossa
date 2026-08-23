import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Navigation } from '@/components/navigation'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Navigation />
			{children}
		</>
	)
}
