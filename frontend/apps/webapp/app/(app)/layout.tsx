import { Navigation } from '@glossa/ui'

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
