import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Navigation } from '@/components/navigation'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={cn('h-full antialiased')}>
			<body className="min-h-full flex flex-col font-sans">
				<TooltipProvider delayDuration={200}>
					<Navigation />
					{children}
				</TooltipProvider>
			</body>
		</html>
	)
}
