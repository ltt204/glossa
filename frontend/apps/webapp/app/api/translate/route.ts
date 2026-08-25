import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '../../lib/api-server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const { text, target } = await request.json()
		const signal = request.signal

		const res = await apiFetch('api/translate', {
			method: 'POST',
			body: JSON.stringify({ text, target }),
			signal: signal,
		})

		return NextResponse.json(res)
	} catch (error: any) {
		if (error === 'AbortSignal') {
			return NextResponse.json(
				{ success: false, message: 'Aborted' },
				{ status: 499 },
			)
		}
		return NextResponse.json(
			{ success: false, message: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
