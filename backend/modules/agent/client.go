package agent

import "context"

type AgentTool struct {
	ID          string
	Description string
	Action      func(ctx context.Context)
}
