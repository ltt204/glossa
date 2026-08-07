package translator

import (
	"context"
	"fmt"
	"log"
	"time"

	"glossa/modules/definition"
	"glossa/modules/translator/dtos"

	"cloud.google.com/go/translate"
	"golang.org/x/sync/errgroup"
	"golang.org/x/text/language"
)

type TranslationService struct {
	Client  *GoogleClient
	DictApi string
	DefSvc  *definition.WordDefinitionService
}

func NewTranslationService(client *GoogleClient, dictApi string, defSvc *definition.WordDefinitionService) (*TranslationService, error) {
	return &TranslationService{Client: client, DictApi: dictApi, DefSvc: defSvc}, nil
}

func (svc *TranslationService) Translate(ctx context.Context, input string, target string) (dtos.WordResult, error) {
	eg, egcx := errgroup.WithContext(ctx)

	var result dtos.WordResult

	eg.Go(func() error {
		res, err := svc.fetchGoogleTranslate(egcx, input, target)
		if err == nil {
			result.Translations = res
			log.Println("Translation Service: ", result)
			return nil
		}

		return err
	})

	eg.Go(func() error {
		def, err := svc.DefSvc.GetWordDefinition(egcx, input)
		if err == nil {
			result.Definitions = def
			log.Println("Definition Service: ", result)
			return nil
		}

		return err
	})

	if err := eg.Wait(); err != nil {
		return dtos.WordResult{}, err
	}

	return result, nil
}

func (svc *TranslationService) fetchGoogleTranslate(ctx context.Context, input string, target string) ([]translate.Translation, error) {
	langTag := language.Make(target)

	maxAttempts := 4
	backoff := time.Second

	for attempt := 1; attempt <= maxAttempts; attempt++ {
		result, err := svc.Client.client.Translate(ctx, []string{input}, langTag, nil)
		if err == nil {
			log.Println("Translated Word: ", result)
			return result, nil
		}

		// Only retry on rate-limit errors (403). Any other error (400 bad input,
		// 401 auth failure, etc.) should fail immediately — retrying won't help.
		if !isRateLimitError(err) || attempt == maxAttempts {
			return []translate.Translation{}, fmt.Errorf("Google Cloud Error: %w", err)
		}

		// Wait before next attempt, then double the wait time (exponential backoff)
		select {
		case <-ctx.Done():
			// The HTTP request was cancelled — stop retrying
			return []translate.Translation{}, ctx.Err()
		case <-time.After(backoff):
			backoff *= 2
		}
	}

	return []translate.Translation{}, fmt.Errorf("translation failed after %d attempts", maxAttempts)
}

func (svc *TranslationService) GetSupportedLanguage() ([]Language, error) {
	return nil, fmt.Errorf("Not implemented")
}
