import { Languages } from 'lucide-react'

export function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="grid min-h-svh md:grid-cols-2">
			{/* Left: Welcome to Glossa */}
			<div className="hidden md:flex flex-col justify-between bg-primary/5 p-10">
				<div className="flex items-center gap-2.5">
					<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
						<Languages className="w-4 h-4 text-primary" />
					</div>
					<span className="w-4 text-primary"> Glossa</span>
				</div>

				<div className="space-y-5">
					<h2 className="text-3xl font-heading font-semibold leading-tight tracking-tight">
						Translate anything.
						<br />
						Remember everything.
					</h2>

					<p className="max-w-xs text-sm text-muted-foreground">
						save the words you look up and turn them into vocabulary ou actually
						keep.
					</p>
				</div>

				<div className="h-32 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"></div>
			</div>

			{/* Right: Auth Form */}
			<div className="flex items-center justify-center p-6 md:p-10">
				<div className="w-full max-w-sm space-y-6">
					<div className="space-y-1.5">
						<h1 className="text-2xl font-heading font-semibold tracking-tight">
							Welcome
						</h1>
						<p className="text-sm text-muted-background">
							Sign in to your Glossa Account
						</p>
					</div>
				</div>

				<div className="grid place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground p-6">
					{children}
				</div>
			</div>
		</div>
	)
}
