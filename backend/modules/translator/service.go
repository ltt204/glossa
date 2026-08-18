package translator

import (
	"context"
	"fmt"
	"log"
	"time"

	"glossa/modules/definition"
	"glossa/modules/translator/dtos"

	translate "cloud.google.com/go/translate/apiv3"
	"cloud.google.com/go/translate/apiv3/translatepb"
	"golang.org/x/sync/errgroup"
)

type TranslationService struct {
	Client    *translate.TranslationClient
	DictApi   string
	ProjectID string
	DefSvc    *definition.WordDefinitionService
}

func NewTranslationService(
	client *translate.TranslationClient,
	dictApi string,
	projectID string,
	defSvc *definition.WordDefinitionService,
) (*TranslationService, error) {
	return &TranslationService{Client: client, DictApi: dictApi, ProjectID: projectID, DefSvc: defSvc}, nil
}

func (svc *TranslationService) Translate(ctx context.Context, input string, target string) (dtos.WordResult, error) {
	eg, egcx := errgroup.WithContext(ctx)

	var result dtos.WordResult

	eg.Go(func() error {
		res, err := svc.fetchGoogleTranslate(egcx, input, target)
		if err == nil {
			for _, t := range res {
				result.Translations = append(result.Translations, toTranslationResponse(t))
			}

			log.Println("Translation Service: ", result)
			return nil
		}

		log.Printf("Translation Service: %v", err)

		return err
	})

	eg.Go(func() error {
		def, err := svc.DefSvc.GetWordDefinition(egcx, input)
		if err == nil {
			result.Definitions = def
			log.Println("Definition Service: ", result)
			return nil
		}

		log.Printf("Definition Service: %v", err)

		return err
	})

	if err := eg.Wait(); err != nil {
		return dtos.WordResult{}, err
	}

	return result, nil
}

func (svc *TranslationService) fetchGoogleTranslate(ctx context.Context, input string, target string) ([]*translatepb.Translation, error) {
	maxAttempts := 4
	backoff := time.Second

	for attempt := 1; attempt <= maxAttempts; attempt++ {
		result, err := svc.Client.TranslateText(ctx, &translatepb.TranslateTextRequest{
			Contents:           []string{input},
			Parent:             fmt.Sprintf("projects/%s", svc.ProjectID),
			TargetLanguageCode: target,
		})
		if err == nil {
			log.Printf("Translated Word: %v \n", result)
			return result.Translations, nil
		}

		// Only retry on rate-limit errors (403). Any othererror (400 bad input,
		// 401 auth failure, etc.) should fail immediately — retrying won't help.
		if !isRateLimitError(err) || attempt == maxAttempts {
			return []*translatepb.Translation{}, fmt.Errorf("Google Cloud Error: %w", err)
		}

		// Wait before next attempt, then double the wait time (exponential backoff)
		select {
		case <-ctx.Done():
			// The HTTP request was cancelled — stop retrying
			return []*translatepb.Translation{}, ctx.Err()
		case <-time.After(backoff):
			backoff *= 2
		}
	}

	return []*translatepb.Translation{}, fmt.Errorf("translation failed after %d attempts", maxAttempts)
}

func (svc *TranslationService) GetSupportedLanguage() ([]Language, error) {
	return nil, fmt.Errorf("Not implemented")
}
