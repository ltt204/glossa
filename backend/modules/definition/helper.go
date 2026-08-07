package definition

import "encoding/json"

func ParseDictionaryEntry(data []byte) ([]DictionaryEntry, error) {
	var entry []DictionaryEntry
	if err := json.Unmarshal(data, &entry); err != nil {
		return nil, err
	}
	return entry, nil
}
