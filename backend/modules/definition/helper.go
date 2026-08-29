package definition

import (
	"encoding/json"
)

func ParseDictionaryEntry(data []byte) ([]WordDefinitions, error) {
	var entry []WordDefinitions
	if err := json.Unmarshal(data, &entry); err != nil {
		return nil, err
	}
	return entry, nil
}

func ParseLLMResponseToMeaning(data []byte) ([]Meaning, error) {
	var entry []Meaning
	if err := json.Unmarshal(data, &entry); err != nil {
		return nil, err
	}
	return entry, nil
}
