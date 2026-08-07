package definition

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
)

type WordDefinitionService struct {
	DictApi string
}

func NewWordDefinitionService(dictApi string) *WordDefinitionService {
	return &WordDefinitionService{DictApi: dictApi}
}

func (svc *WordDefinitionService) GetWordDefinition(ctx context.Context, word string) (WordDefinitions, error) {
	dictUrl := svc.DictApi + word
	result := WordDefinitions{}
	response, err := http.Get(dictUrl)
	if err != nil {
		return result, err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return result, fmt.Errorf("dictionary api error: %s", response.Status)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatalf("Failed to read body: %v", err)
	}

	parsedResult, err := ParseDictionaryEntry(body)
	if err != nil {
		return result, err
	}

	return WordDefinitions{
		Entries: parsedResult,
	}, nil
}
