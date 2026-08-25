'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetch } from '@/app/lib/api-server'
import { SignInResponse, SignUpResponse } from '@glossa/core'

export interface LoginState {
	isSuccess: boolean
	message: string
}

export async function signin(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const email = String(formData.get('email') ?? '')
	const password = String(formData.get('password') ?? '')

	if (!email || !password) {
		return {
			isSuccess: false,
			message: 'All fields are required',
		}
	}

	const res = await apiFetch<SignInResponse>(`api/auth/signin`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: email,
			password: password,
		}),
		cache: 'no-store',
	})
	if (!res.success || !res.content) {
		return { isSuccess: res.success, message: res.message ?? 'Sign in failed.' }
	}

	const { user, accessToken, refreshToken } = res.content
	if (!accessToken || !refreshToken || !user) {
		return { isSuccess: false, message: 'Sign in Failed.' }
	}

	await setCredentialsCookie(accessToken, refreshToken, user.id)

	redirect('/translate')
}

export type SignUpState = { message: string }

export async function signup(
	_previousState: SignUpState,
	formData: FormData,
): Promise<SignUpState> {
	// const name = String(formData.get("name") ?? "")
	const email = String(formData.get('email') ?? '')
	const password = String(formData.get('password') ?? '')

	if (!email || !password) {
		return { message: 'All fields are required' }
	}

	const res = await apiFetch<SignUpResponse>(`api/auth/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
		cache: 'no-store',
	})

	if (!res.success || !res.content) {
		return { message: res.message ?? 'Sign up failed.' }
	}

	const { user, accessToken, refreshToken } = res.content
	if (!accessToken || !refreshToken || !user) {
		return { message: 'Sign up Failed.' }
	}

	await setCredentialsCookie(accessToken, refreshToken, user.id)

	redirect('/translate')
}

async function setCredentialsCookie(
	accessToken: string,
	refreshToken: string,
	userId: string,
) {
	const cookieStore = await cookies()
	const secure = process.env.NODE_ENV === 'production'

	cookieStore.set('access_token', accessToken, {
		httpOnly: true,
		secure,
		sameSite: 'lax',
		path: '/',
		maxAge: 15 * 60,
	})

	cookieStore.set('refresh_token', refreshToken, {
		httpOnly: true,
		secure,
		sameSite: 'lax',
		path: '/',
		maxAge: 7 * 24 * 60 * 60,
	})

	cookieStore.set('user_id', userId, {
		httpOnly: false,
		secure,
		sameSite: 'lax',
		path: '/',
		maxAge: 7 * 24 * 60 * 60,
	})
}

export async function logout() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value

	if (accessToken) {
		await fetch(`/api/auth/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			cache: 'no-store',
		}).catch(() => null)
	}

	cookieStore.delete('access_token')
	cookieStore.delete('refresh_token')

	redirect('/login')
}
