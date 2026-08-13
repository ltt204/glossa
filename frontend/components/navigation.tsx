'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Languages, BookMarked, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/auth/action'
import { Button } from './ui/button'

const LINKS = [
	{ href: '/translate', label: 'Translator', icon: Languages },
	{ href: '/words', label: 'Words', icon: BookMarked },
] as const

export function Navigation() {
	const pathname = usePathname()

	return (
		<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
			<div className="frost-panel flex items-center gap-1 rounded-full border border-border/40 shadow-lg shadow-primary/5 p-1">
				{LINKS.map(({ href, label, icon: Icon }) => {
					const active = pathname === href
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
								active
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
							)}
						>
							<Icon className="w-3.5 h-3.5" />
							{label}
						</Link>
					)
				})}

				<form action={logout}>
					<Button
						type="submit"
						aria-label="Sign out"
						className="flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/60 hover:text-foreground cursor-pointer"
					>
						<LogOut className="w-3.5 h-3.5" />
					</Button>
				</form>
			</div>
		</nav>
	)
}
