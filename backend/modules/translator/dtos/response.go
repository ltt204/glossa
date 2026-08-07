package dtos

import (
	"glossa/modules/definition"

	"cloud.google.com/go/translate"
)

type WordResult struct {
	Translations []translate.Translation    `json:"translations"`
	Definitions  definition.WordDefinitions `json:"definitions"`
}
