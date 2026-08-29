package translator

import (
	"glossa/modules/definition"
)

type WordResult struct {
	Translations []TranslationResponse        `json:"translations"`
	Definitions  []definition.WordDefinitions `json:"definitions"`
}

type TranslationResponse struct {
	TranslatedText       string `json:"translatedText"`
	DetectedLanguageCode string `json:"detectedLanguageCode"`
}

type TranslateRequest struct {
	Text   string `json:"text"`
	Target string `json:"target"`
}
