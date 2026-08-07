'use client'

import { LoginState, signin } from '@/lib/auth/action'
import { useActionState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

const initialState: LoginState = { message: '' }

export function LoginForm() {
	const [state, formAction, pending] = useActionState(signin, initialState)

	return (
		<form action={formAction} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="password">Email</Label>
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

			{state.message && (
				<p aria-live="polite" className="w-full">
					{state.message}
				</p>
			)}

			<Button type="submit" disabled={pending} className="w-full">
				{pending ? 'Signing in...' : 'Sign in'}
			</Button>
		</form>
	)
}
