import { useActionState } from 'react'
import { LoginState, signin } from '@glossa/core'
import { Button, Input, Label } from '@glossa/ui'

interface Props {
	onLogin: () => void
}

const initialState = new LoginState()

export default function LoginView({ onLogin }: Props) {
	const [state, formAction, pending] = useActionState(signin, initialState)

	return (
		<div className="flex flex-col h-screen bg-white p-6">
			<h1 className="text-2xl font-bold text-gray-900 mb-1">Glossa</h1>
			<p className="text-sm text-gray-500 mb-8">Sign in to start translating</p>

			<form action={formAction} className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<Label className="text-sm font-medium text-gray-700">Email</Label>
					<Input
						type="email"
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="you@example.com"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<Label className="text-sm font-medium text-gray-700">Password</Label>
					<Input
						type="password"
						required
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="••••••••"
					/>
				</div>

				{!state.isSuccess && (
					<p aria-live="polite" className="w-full text-destructive">
						{state.message}
					</p>
				)}

				<Button type="submit" disabled={pending} className="w-full">
					{pending ? 'Signing in…' : 'Sign in'}
				</Button>
			</form>
		</div>
	)
}
