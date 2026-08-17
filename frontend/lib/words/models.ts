import { z } from 'zod'

export const WordSchema = z.object({
	id: z.string(),
	origin: z.string(),
	source: z.string(),
	translated: z.string(),
	target: z.string(),
	createdAt: z.string(),
})

export type Word = z.infer<typeof WordSchema>

export const CreateWordInputSchema = z.object({
	origin: z.string(),
	source: z.string(),
	translated: z.string(),
	target: z.string(),
})

export type CreateWordInput = z.infer<typeof CreateWordInputSchema>

export const BackendWordSchema = z.object({
	id: z.string().optional(),
	origin: z.string().optional(),
	source: z.string().optional(),
	translated: z.string().optional(),
	target: z.string().optional(),
	createdAt: z.string().optional(),
	Id: z.string().optional(),
	Origin: z.string().optional(),
	SourceLang: z.string().optional(),
	Translated: z.string().optional(),
	TargetLang: z.string().optional(),
})

export type BackendWord = z.infer<typeof BackendWordSchema>

export function normalizeWord(input: BackendWord): Word {
	return {
		id: input.id ?? input.Id ?? '',
		origin: input.origin ?? input.Origin ?? '',
		source: input.source ?? input.SourceLang ?? '',
		translated: input.translated ?? input.Translated ?? '',
		target: input.target ?? input.TargetLang ?? '',
		createdAt: input.createdAt ?? '',
	}
}

// Central error so callers can distinguish network/HTTP failures from app bugs.
export class WordsApiError extends Error {
	constructor(
		message: string,
		public status?: number,
	) {
		super(message)
		this.name = 'WordsApiError'
	}
}
