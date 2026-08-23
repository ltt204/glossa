'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetch } from '../api-server'
import { SignInResponse } from './models'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export type LoginState = { message: string }

export async function signin(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const email = String(formData.get('email') ?? '')
	const password = String(formData.get('password') ?? '')

	if (!email || !password) {
		return { message: 'All fields are required' }
	}

	const res = await apiFetch<SignInResponse>(`${API_URL}/api/auth/signin`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
		cache: 'no-store',
	})

	if (!res) {
		return { message: 'Could not reach the server.' }
	}

	if (!res.success || !res.content) {
		return { message: res.message ?? 'Sign in failed.' }
	}

	const { accessToken, refreshToken } = res.content
	if (!accessToken || !refreshToken) {
		return { message: 'Sign in Failed.' }
	}

	await setCredentialsCookie(accessToken, refreshToken)

	redirect('/')
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

	const res = await fetch(`${API_URL}/api/auth/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
		cache: 'no-store',
	}).catch(() => null)

	if (!res) {
		return { message: 'Could not reach the server.' }
	}

	const body = await res.json().catch(() => null)
	if (!res.ok || typeof body !== 'object' || body === null) {
		return { message: body?.message ?? 'Sign up failed.' }
	}

	const { access_token, refresh_token } = body?.content ?? {}
	if (!access_token || !refresh_token) {
		return { message: 'Sign up Failed.' }
	}

	await setCredentialsCookie(access_token, refresh_token)

	redirect('/')
}

export async function setCredentialsCookie(
	access_token: string,
	refresh_token: string,
) {
	const cookieStore = await cookies()
	const secure = process.env.NODE_ENV === 'production'

	cookieStore.set('access_token', access_token, {
		httpOnly: true,
		secure,
		sameSite: 'lax',
		path: '/',
		maxAge: 15 * 60,
	})

	cookieStore.set('refresh_token', refresh_token, {
		httpOnly: true,
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
		await fetch(`${API_URL}/api/auth/logout`, {
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
