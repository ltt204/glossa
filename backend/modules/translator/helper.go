package translator

import (
	"encoding/json"
	"errors"
	"strings"

	"cloud.google.com/go/translate"
)

func Join(inputs []translate.Translation) string {
	var result strings.Builder

	for _, input := range inputs {
		result.WriteString(input.Text)
	}

	return result.String()
}

// errorAs is a thin wrapper around errors.As.
// It lets service.go stay clean without importing "errors" directly.
func errorAs(err error, target any) bool {
	return errors.As(err, target)
}

func ParseDictionaryEntry(data []byte) ([]DictionaryEntry, error) {
	var entry []DictionaryEntry
	if err := json.Unmarshal(data, &entry); err != nil {
		return nil, err
	}
	return entry, nil
}
