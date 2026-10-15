package translator

import (
	"glossa/modules/agent"
	"glossa/modules/definition"
)

// goverter:converter
// goverter:output:file ./converter_gen.go
type TranslationConverter interface {
	ToSystemMeaning(source agent.LLMResponse) definition.Meaning

	ToSystemMeaningList(source []agent.LLMResponse) []definition.Meaning

	ToSystemDefinition(source agent.LLMDefinition) definition.Definition

	ToSystemDefinitionList(source []agent.LLMDefinition) []definition.Definition
}
