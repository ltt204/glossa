export type TranslateRequest = {
	text: string
	target: string
}

export type TranslateResult = {
	translations: Translate[]
	definitions: DictionaryEntry[]
}

export type DictionaryEntry = {
	word: string
	phonetics: Phonetic[]
	origin: string
	meanings: Meaning[]
}

export type Phonetic = {
	text: string
	audio: string
}

export type Meaning = {
	partOfSpeech: string
	definitions: Definition[]
}

export type Definition = {
	definition: string
	example: string
	synonyms: string[]
	antonyms: string[]
}

export type Translate = {
	translatedText: string
	detectedLanguageCode: string
}
