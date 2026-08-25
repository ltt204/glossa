'use client'

import { useActionState } from 'react'
import { Label, Input, Button, Separator } from '@glossa/ui'
import { LoginState, signin } from '@/app/lib/auth/actions'

const initialState = new LoginState()

export function LoginForm() {
	const [state, formAction, pending] = useActionState(signin, initialState)

	return (
		<div className="grid gap-2">
			<form action={formAction} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="your.email@gmail.com"
						autoComplete="email"
						required
					></Input>
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
					></Input>
				</div>

				{!state.isSuccess && (
					<p aria-live="polite" className="w-full text-destructive">
						{state.message}
					</p>
				)}

				<Button type="submit" disabled={pending} className="w-full">
					{pending ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>
			<Separator />
			<div className="space-y-2">
				<span>
					Don't have an account?{' '}
					<a className="text-primary link" href="/signup">
						Sign up
					</a>
				</span>
			</div>
		</div>
	)
}
