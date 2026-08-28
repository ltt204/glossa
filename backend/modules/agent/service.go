package agent

import (
	"context"
	"fmt"
	"glossa/internal/apperror"
	"glossa/modules/definition"
	"log"
	"os"

	"charm.land/fantasy"
	"charm.land/fantasy/providers/openrouter"
)

type AgentService interface {
	CallOpenRouterAgent(ctx context.Context, props TranslateProps) (struct{}, *apperror.AppError)
}

type agentService struct {
	definitionService *definition.WordDefinitionService
}

func NewAgentService(definitionService *definition.WordDefinitionService) AgentService {
	return &agentService{definitionService: definitionService}
}

// / Translate Props
type TranslateProps struct {
	TargetLang   string
	SourceLang   string
	Origin       string
	PartOfSpeech []string
}

func (s *agentService) CallOpenRouterAgent(ctx context.Context, props TranslateProps) (struct{}, *apperror.AppError) {
	// Provider initialization
	provider, err := openrouter.New(openrouter.WithAPIKey("YOUR_API_KEY"))
	if err != nil {
		log.Fatal(err)
	}

	bgContext := context.Background()
	defer bgContext.Done()

	// model, err := provider.LanguageModel(bgContext, "nvidia/nemotron-3-ultra-550b-a55b:free")
	model, err := provider.LanguageModel(bgContext, "nvidia/nemotron-3-ultra-550b-a55b:free")
	if err != nil {
		log.Fatal(err)
	}
	// End of initialization

	// Prompt construction
	prompt := ConstructTranslationPrompt(props)
	// End of prompt construction

	// Agent initialization
	agent := fantasy.NewAgent(
		model,
		fantasy.WithMaxRetries(3),
	)
	// End of agent initialization

	// Put that agent to work!
	result, err := agent.Generate(ctx, fantasy.AgentCall{Prompt: prompt})
	if err != nil {
		fmt.Println(os.Stderr, "Oof:", err)
		return struct{}{}, nil
	}
	fmt.Println(result.Response.Content.Text())

	return struct{}{}, nil
}
