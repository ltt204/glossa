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
	agent             fantasy.Agent
}

func NewAgentService(definitionService *definition.WordDefinitionService, agent fantasy.Agent) AgentService {
	return &agentService{definitionService: definitionService, agent: agent}
}

func (s *agentService) CallOpenRouterAgent(ctx context.Context, props TranslateProps) ([]LLMResponse, error) {

	prompt := ConstructTranslationPrompt(props)
	result, err := s.agent.Generate(ctx, fantasy.AgentCall{Prompt: prompt})
	if err != nil {
		return nil, err
	}

	llmResponse, err := new(LLMResponse).Parse(result.Response.Content.Text())

	if err != nil {
		return nil, err
	}

	return llmResponse, nil
}
