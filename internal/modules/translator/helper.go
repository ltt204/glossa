package translator

import (
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
