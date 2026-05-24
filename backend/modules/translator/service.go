package translator

import (
	"context"
	"fmt"
	"time"

	"golang.org/x/text/language"
	"google.golang.org/api/googleapi"
)

type TranslationService struct {
	Client *GoogleClient
}

func NewTranslationService(client *GoogleClient) (*TranslationService, error) {
	return &TranslationService{Client: client}, nil
}

// Functions for using translation services

func (svc *TranslationService) DetectLanguage() {

}

func (svc *TranslationService) Translate(ctx context.Context, input string, target string) (string, error) {
	langTag := language.Make(target)

	// Retry with exponential backoff to handle rate limit errors (403 userRateLimitExceeded).
	//
	// Google's Translation API has a per-second/per-100s rate limit that is separate
	// from the daily quota. When hit, the right response is to wait and retry —
	// not to fail immediately.
	//
	// Attempts: 1st try → wait 1s → 2nd try → wait 2s → 3rd try → wait 4s → give up
	maxAttempts := 4
	backoff := time.Second

	for attempt := 1; attempt <= maxAttempts; attempt++ {
		result, err := svc.Client.client.Translate(ctx, []string{input}, langTag, nil)
		if err == nil {
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

	// This line is never reached but the compiler requires it
	return "", fmt.Errorf("translation failed after %d attempts", maxAttempts)
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
