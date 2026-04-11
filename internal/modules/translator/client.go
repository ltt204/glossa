package translator

import (
	"context"
	"fmt"

	"cloud.google.com/go/translate"
)

type GoogleClient struct {
	client *translate.Client
}

// The SDK can read the .env for finding the GOOGLE_APPLICATION_CREDENTIALS
// type ConnectionParams struct {
// }

// TODO: expect to properly custom error for this app
func NewGoogleClient(ctx context.Context) (*GoogleClient, error) {
	// Start the connection
	client, err := translate.NewClient(ctx)

	if err != nil {
		return nil, fmt.Errorf("translator: Failed to  create client: %w", err)
	}

	return &GoogleClient{
		client: client,
	}, nil
}

func (gc *GoogleClient) Close() error {
	return gc.client.Close()
}
