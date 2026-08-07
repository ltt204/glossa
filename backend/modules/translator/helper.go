package translator

import (
	"errors"
	"strings"

	"cloud.google.com/go/translate"
	"google.golang.org/api/googleapi"
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

func isRateLimitError(err error) bool {
	var apiErr *googleapi.Error
	if ok := errorAs(err, &apiErr); ok {
		return apiErr.Code == 403 || apiErr.Code == 429
	}
	return false
}
