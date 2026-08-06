package words

type WordSavingRequest struct {
	Origin string
	Source string

	Translated string
	Target     string
}

type WordResponse struct {
	ID         string `json:"id"`
	UserId     string `json:"user_id"`
	Origin     string `json:"origin"`
	SourceLang string `json:"source_lang"`
	Translated string `json:"translated"`
	TargetLang string `json:"target_lang"`
	IsSaved    bool   `json:"is_saved"`
}
