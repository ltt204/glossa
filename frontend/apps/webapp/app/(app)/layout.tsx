import { Navigation } from '@/app/components'

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
