package dtos

import (
	"glossa/modules/definition"

	"cloud.google.com/go/translate/apiv3/translatepb"
)

type WordResult struct {
	Translations []*translatepb.Translation `json:"translations"`
	Definitions  definition.WordDefinitions `json:"definitions"`
}
