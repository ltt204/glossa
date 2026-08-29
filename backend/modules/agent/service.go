package agent

import (
	"context"
	"glossa/modules/definition"

	"charm.land/fantasy"
)

type AgentService interface {
	CallOpenRouterAgent(ctx context.Context, props TranslateProps) ([]LLMResponse, error)
}

type agentService struct {
	definitionService *definition.WordDefinitionService
	agentConfig       *AgentConfig
}

func NewAgentService(definitionService *definition.WordDefinitionService, agentConfig *AgentConfig) AgentService {
	return &agentService{definitionService: definitionService, agentConfig: agentConfig}
}

func (s *agentService) CallOpenRouterAgent(ctx context.Context, props TranslateProps) ([]LLMResponse, error) {
	agent := GetAgentByConfig(s.agentConfig)

	prompt := ConstructTranslationPrompt(props)
	result, err := agent.Generate(ctx, fantasy.AgentCall{Prompt: prompt})
	if err != nil {
		return []LLMResponse{}, nil
	}

	llmResponse, err := new(LLMResponse).Parse(result.Response.Content.Text())

	if err != nil {
		return []LLMResponse{}, nil
	}

	return llmResponse, nil
}
