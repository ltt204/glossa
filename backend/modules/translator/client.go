package translator

import (
	"context"
	"glossa/internal/apperror"

	"log"

	translate "cloud.google.com/go/translate/apiv3"
)

func NewGoogleClient(ctx context.Context) (*translate.TranslationClient, error) {
	client, err := translate.NewTranslationClient(ctx)

	if err != nil {
		log.Fatal("Failed to create Google Client")
		return nil, apperror.InternalServerError.WithMessage("Something went wrong.")
	}

	return client, nil
}
