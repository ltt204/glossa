package words

type WordSavingRequest struct {
	Origin     string `json:"origin" binding:"required" example:"hello"`
	SourceLang string `json:"sourceLang" binding:"required" example:"en"`
	Translated string `json:"translated" binding:"required" example:"xin chào"`
	TargetLang string `json:"targetLang" binding:"required" example:"vi"`
}

type WordResponse struct {
	ID         string `json:"id"`
	UserID     string `json:"userId"`
	Origin     string `json:"origin"`
	SourceLang string `json:"sourceLang"`
	Translated string `json:"translated"`
	TargetLang string `json:"targetLang"`
	IsSaved    bool   `json:"isSaved"`
}

// Success Response Wrappers for Swagger
type WordSaveSuccessWrapper struct {
	Content WordResponse `json:"content"`
}

type WordListSuccessWrapper struct {
	Content []WordResponse `json:"content"`
}
