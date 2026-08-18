import { z } from 'zod'

export const WordSchema = z.object({
	id: z.string(),
	userId: z.string(),
	origin: z.string(),
	sourceLang: z.string(),
	translated: z.string(),
	targetLang: z.string(),
	isSaved: z.boolean(),
})

export type Word = z.infer<typeof WordSchema>

export const CreateWordInputSchema = z.object({
	origin: z.string(),
	source: z.string(),
	translated: z.string(),
	target: z.string(),
})

export type CreateWordInput = z.infer<typeof CreateWordInputSchema>

export class WordsApiError extends Error {
	constructor(
		message: string,
		public status?: number,
	) {
		super(message)
		this.name = 'WordsApiError'
	}
}
