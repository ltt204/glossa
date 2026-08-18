import 'server-only'
import { cookies } from 'next/headers'
import {
	createServerResponseSchema,
	RefreshTokenResponse,
	RefreshTokenResponseSchema,
	ServerResponse,
} from './models'
import z from 'zod'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiFetch<T>(
	path: string,
	request: RequestInit,
): Promise<ServerResponse<T>> {
	const fullpath = `${API_URL}/${path}`
	const cookieStore = await cookies()
	const access_token = cookieStore.get('access_token')

	const headers = new Headers(request.headers)

	if (access_token) {
		headers.set('Authorization', `Bearer ${access_token.value}`)
	}

	const response = await fetch(fullpath, {
		...request,
		headers,
		cache: 'no-store',
	})

	if (response.status === 401) {
		console.log('Hit UNAUTHORIZED. Start to refresh the token...')
		const tokens = await refreshAccessToken()

		console.log('Refreshing response: ', tokens)
		if (tokens) {
			headers.set('Authorization', `Bearer ${tokens.accessToken}`)
			console.log('Token refreshed successfully. Retry the request...')
			return await handleServerResponse<T>(
				await fetch(fullpath, { ...request, headers, cache: 'no-store' }),
			)
		}

		console.log('Failed to refresh tokens')
	}

	return handleServerResponse<T>(response)
}

async function refreshAccessToken(): Promise<RefreshTokenResponse | null> {
	const cookieStore = await cookies()
	const currentRefreshToken = cookieStore.get('refresh_token')?.value

	if (currentRefreshToken) {
		const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				refreshToken: currentRefreshToken,
			}),
		})

		if (refreshResponse.ok) {
			const refreshData = await refreshResponse
				.json()
				.then((res: ServerResponse<RefreshTokenResponse>) => res.content)

			if (!refreshData) return null

			cookieStore.set('access_token', refreshData.accessToken)
			cookieStore.set('refresh_token', refreshData.refreshToken)

			return refreshData
		}
	}

	return null
}

async function handleServerResponse<T>(
	response: Response,
): Promise<ServerResponse<T>> {
	const ServerResponseSchema = createServerResponseSchema(z.any())

	const result: ServerResponse<T> = {
		success: false,
		message: 'Failed to fetch data.',
	}
	if (!response.ok) {
		const data = await response.json()
		const parsedDate = ServerResponseSchema.parse(data)
		return parsedDate as ServerResponse<T>
	}

	const serverResponse = await response.json()
	const parsedData = ServerResponseSchema.parse(serverResponse)
	if (!parsedData.success) {
		return result
	}

	return parsedData as ServerResponse<T>
}
