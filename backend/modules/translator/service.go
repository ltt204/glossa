package translator

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"golang.org/x/text/language"
	"google.golang.org/api/googleapi"
)

type TranslationService struct {
	Client  *GoogleClient
	DictApi string
}

func NewTranslationService(client *GoogleClient, dictApi string) (*TranslationService, error) {
	return &TranslationService{Client: client, DictApi: dictApi}, nil
}

func (svc *TranslationService) Translate(ctx context.Context, input string, target string) (string, error) {
	langTag := language.Make(target)

	maxAttempts := 4
	backoff := time.Second

	for attempt := 1; attempt <= maxAttempts; attempt++ {
		result, err := svc.Client.client.Translate(ctx, []string{input}, langTag, nil)
		if err == nil {
			log.Println("Translated Word: ", result)
			return Join(result), nil
		}

		// Only retry on rate-limit errors (403). Any other error (400 bad input,
		// 401 auth failure, etc.) should fail immediately — retrying won't help.
		if !isRateLimitError(err) || attempt == maxAttempts {
			return "", fmt.Errorf("Google Cloud Error: %w", err)
		}

		// Wait before next attempt, then double the wait time (exponential backoff)
		select {
		case <-ctx.Done():
			// The HTTP request was cancelled — stop retrying
			return "", ctx.Err()
		case <-time.After(backoff):
			backoff *= 2
		}
	}

	return "", fmt.Errorf("translation failed after %d attempts", maxAttempts)
}

// TODO: Properly handle parsing object since I declared all other structure in model.go of Translator module.
func (svc *TranslationService) GetWordDefinition(ctx context.Context, word string) (string, error) {
	response, err := http.Get(svc.DictApi + word)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("dictionary api error: %s", response.Status)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatalf("Failed to read body: %v", err)
	}

	result, err := ParseDictionaryEntry(body)
	if err != nil {
		return "", err
	}

	fmt.Println("Translated Word: ", result)

	return result[0].Meanings[0].Definitions[0].Definition, nil
}

// isRateLimitError returns true when Google rejected the request due to rate
// limiting (HTTP 403 userRateLimitExceeded or 429 Too Many Requests).
func isRateLimitError(err error) bool {
	var apiErr *googleapi.Error
	if ok := errorAs(err, &apiErr); ok {
		return apiErr.Code == 403 || apiErr.Code == 429
	}
	return false
}

func (svc *TranslationService) GetSupportedLanguage() ([]Language, error) {
	return nil, fmt.Errorf("Not implemented")
}
