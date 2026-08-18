'use server'
import { apiFetch } from '../api-server'
import { WordsApiError, Word, CreateWordInput } from './models'

export async function getWords(): Promise<Word[]> {
	const res = await apiFetch<Word[]>('api/words', {
		method: 'GET',
		headers: { Accept: 'application/json' },
	})

	if (!res.success || !res.content) {
		throw new WordsApiError(res.message ?? 'Failed to fetch words')
	}

	if (!Array.isArray(res.content)) return []
	return res.content
}

export async function saveWord(input: CreateWordInput): Promise<Word> {
	console.log('REQ:', JSON.stringify(input, null, 2))

	const res = await apiFetch<Word>(`api/words`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	console.log('RES:', res)

	if (!res.success || !res.content) {
		throw new WordsApiError(res.message ?? 'Failed to save word')
	}

	return res.content
}

export async function deleteWord(id: string): Promise<void> {
	const res = await apiFetch<void>(`/api/words/${id}`, {
		method: 'DELETE',
	})

	if (!res.success || !res.content) {
		throw new WordsApiError(res.message ?? 'Failed to delete word')
	}

	return res.content
}
