import { z } from 'zod'

export const TranslateRequestSchema = z.object({
	text: z.string(),
	target: z.string(),
})

export type TranslateRequest = z.infer<typeof TranslateRequestSchema>

export const PhoneticSchema = z.object({
	text: z.string(),
	audio: z.string(),
})

export type Phonetic = z.infer<typeof PhoneticSchema>

export const DefinitionSchema = z.object({
	definition: z.string(),
	example: z.string().default(''),
	synonyms: z.array(z.string()).default([]),
	antonyms: z.array(z.string()).default([]),
})

export const MeaningSchema = z.object({
	partOfSpeech: z.string(),
	definitions: z.array(DefinitionSchema),
})

export type Meaning = z.infer<typeof MeaningSchema>

export const DictionaryEntrySchema = z.object({
	word: z.string(),
	phonetics: PhoneticSchema.array(),
	origin: z.string(),
	meanings: MeaningSchema.array(),
})

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>

export const TranslateSchema = z.object({
	translatedText: z.string(),
	detectedLanguageCode: z.string(),
})

export type Translate = z.infer<typeof TranslateSchema>

export const TranslateResultSchema = z.object({
	translations: z.array(TranslateSchema).default([]),
	definitions: z.array(DictionaryEntrySchema).default([]),
})

export type TranslateResult = z.infer<typeof TranslateResultSchema>
