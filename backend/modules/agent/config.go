package agent

import (
	"context"
	"errors"
	"log"
	"os"

	"charm.land/fantasy"
	"charm.land/fantasy/providers/openrouter"
)

type AgentConfig struct {
	OpenRouterApiKey string
	OpenrouterModel       string
}

func Load() (*AgentConfig, error) {
	openrouterApiKey := os.Getenv("OPENROUTER_API_KEY")
	if openrouterApiKey == "" {
		return nil, errors.New("OPENROUTER_API_KEY is not set")
	}

	orModel := os.Getenv("OPENROUTER_MODEL")
	if orModel == "" {
		return nil, errors.New("OPENROUTER_MODEL is not set")
	}

	return &AgentConfig{
		OpenRouterApiKey: openrouterApiKey,
		OpenrouterModel:       orModel,
	}, nil
}

func GetAgentByConfig(agentConfig *AgentConfig) fantasy.Agent {
	// Provider initialization
	provider, err := openrouter.New(openrouter.WithAPIKey(agentConfig.OpenRouterApiKey))
	if err != nil {
		log.Fatal(err)
	}

	bgContext := context.Background()
	defer bgContext.Done()

	model, err := provider.LanguageModel(bgContext, agentConfig.OpenrouterModel)
	if err != nil {
		log.Fatal(err)
	}
	// End of initialization

	// Agent initialization
	agent := fantasy.NewAgent(
		model,
		fantasy.WithMaxRetries(3),
	)
	// End of agent initialization

	return agent
}
