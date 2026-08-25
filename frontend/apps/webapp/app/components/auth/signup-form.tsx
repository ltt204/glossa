'use client'

import { useActionState } from 'react'
import { Label, Input, Button, Separator } from '@glossa/ui'
import { SignUpState, signup } from '@/app/lib/auth/actions'
import Link from 'next/link'

const initialState: SignUpState = { message: '' }

export function SignUpForm() {
	const [state, action, pending] = useActionState(signup, initialState)

	return (
		<form action={action} className="space-y-4">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input type="text" id="name" name="name" required autoComplete="name" />
			</div>
			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					type="email"
					id="email"
					name="email"
					required
					autoComplete="email"
				/>
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input type="password" id="password" name="password" required />
			</div>
			{state.message && (
				<p aria-live="polite" className="w-full text-destructive">
					{state.message}
				</p>
			)}
			<Button disabled={pending} type="submit" className="w-full">
				{pending ? 'Signing up...' : 'Sign Up'}
			</Button>

			<Separator />
			<div className="space-y-2">
				<span>
					Already have an account? <Link href="/login">Log in</Link>
				</span>
			</div>
		</form>
	)
}
