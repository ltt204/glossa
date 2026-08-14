package dtos

import (
	"glossa/modules/definition"
)

type WordResult struct {
	Translations []Translation                `json:"translations"`
	Definitions  []definition.WordDefinitions `json:"definitions"`
}

type Translation struct {
	TranslatedText       string `json:"translatedText"`
	DetectedLanguageCode string `json:"detectedLanguageCode"`
}
