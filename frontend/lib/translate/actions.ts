'use server'

import { apiFetch } from '../api-server'
import type { TranslateResult } from './models'

let count = 0

export async function translate(
	text: string,
	target: string,
	signal?: AbortSignal,
): Promise<TranslateResult> {
	console.log(`API made ${count++} with text=${text}`)
	const res = await apiFetch<TranslateResult>(`api/translate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text: text, target: target }),
		signal: signal,
	})

	if (!res.success || !res.content) {
		throw Error(res.message)
	}

	return res.content
}
