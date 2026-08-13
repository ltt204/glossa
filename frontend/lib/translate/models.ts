export type TranslateRequest = {
    text: string;
    target: string;
}


export type TranslateResult = {
    translations: Translate[];
    definitions: WordDefinitions;
}

export type WordDefinitions = {
	Entries: DictionaryEntry[] }

export type DictionaryEntry = {
	Word:      string;     
    Phonetic:  string;     
    Phonetics: Phonetic[]; 
    Origin:    string;     
    Meanings:  Meaning[];  }

export type Phonetic = {
	Text:  string; 
    Audio: string; }

export type Meaning = {
	PartOfSpeech: string;       
    Definitions:  Definition[]; }

export type Definition = {
	Definition: string;   
    Example:    string;   
	Synonyms:   string[]; 
	Antonyms:   string[]; 
}

export type Translate = {
    translatedText: string; 
    detectedLanguageCode: string;
}

