package dtos

type TranslateRequest struct {
	Text   string `json:"text"`
	Target string `json:"target"`
}
