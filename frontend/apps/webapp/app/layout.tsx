import type { Metadata } from 'next'
import { DM_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import Providers from './providers'
import { TooltipProvider } from '@/components/ui/tooltip'

const dmSans = DM_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400', '500', '600', '700'],
})

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-heading',
	weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
	title: 'Glossa — Translator',
	description: 'A sleek sidebar translator powered by Google Cloud',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={cn(
				'h-full antialiased',
				dmSans.variable,
				spaceGrotesk.variable,
			)}
		>
			<body className="min-h-full flex flex-col font-sans">
				<TooltipProvider delayDuration={200}>
					<Providers>{children}</Providers>
				</TooltipProvider>
				<Toaster />
			</body>
		</html>
	)
}
