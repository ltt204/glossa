'use server'
import { apiFetch } from '../api-server'
import {
	WordsApiError,
	normalizeWord,
	Word,
	BackendWord,
	CreateWordInput,
} from './models'

export async function getWords(): Promise<Word[]> {
	const res = await apiFetch('api/words', {
		method: 'GET',
		headers: { Accept: 'application/json' },
	})
	if (!res.success || !res.content) {
		throw new WordsApiError(res.message ?? 'Failed to fetch words')
	}
	const rows = Array.isArray(res.content) ? res.content : res.content
	if (!Array.isArray(rows)) return []
	return rows.map(normalizeWord)
}

export async function createWord(input: CreateWordInput): Promise<Word> {
	const res = await apiFetch<{ content?: BackendWord } | BackendWord>(
		`/api/words`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input),
		},
	)
	const row = 'content' in res ? res.content : res
	if (!row) throw new WordsApiError('Invalid response payload')
	return normalizeWord(row)
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
