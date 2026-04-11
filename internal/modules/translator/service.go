package translator

import (
	"context"
	"fmt"

	"golang.org/x/text/language"
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

	result, err := svc.Client.client.Translate(ctx, []string{input}, langTag, nil)

	if err != nil {
		return "", fmt.Errorf("Not implemented")
	}

	return Join(result), nil
}

func (svc *TranslationService) GetSupportedLanguage() ([]Language, error) {
	return nil, fmt.Errorf("Not implemented")
}
