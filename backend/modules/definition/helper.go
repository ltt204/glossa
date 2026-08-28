package definition

import (
	"encoding/json"
	"fmt"
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
		fmt.Println("Error unmarshalling LLM response: ", err)
		return nil, err
	}
	return entry, nil
}
