package agent

import "charm.land/fantasy"

type ModelAgent struct {
	Provider    string
	ModelName   string
	Temperature float64
}

type Agent interface {
	GetAgentBy(model ModelAgent) fantasy.Provider
}
