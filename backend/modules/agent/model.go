package agent

import (
	"encoding/json"
	"fmt"
)

type TranslateProps struct {
	TargetLang string
	SourceLang string
	Origin     string
	Meanings   string
}

type LLMResponse struct {
	PartOfSpeech string          `json:"partOfSpeech"`
	Translated   string          `json:"translated"`
	Definitions  []LLMDefinition `json:"definitions"`
}

type LLMDefinition struct {
	Definition string   `json:"definition"`
	Example    string   `json:"example"`
	Synonyms   []string `json:"synonyms"`
	Antonyms   []string `json:"antonyms"`
}

func (llm *LLMResponse) Parse(data string) ([]LLMResponse, error) {
	var entry []LLMResponse
	if err := json.Unmarshal([]byte(data), &entry); err != nil {
		fmt.Println("Error parsing LLM response: ", err)
		return nil, err
	}
	return entry, nil
}
