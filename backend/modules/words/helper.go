package words

func (w *Word) ToResponse() WordResponse {
	return WordResponse{
		ID:         w.ID,
		UserID:     w.UserID,
		Origin:     w.Origin,
		SourceLang: w.SourceLang,
		Translated: w.Translated,
		TargetLang: w.TargetLang,
		IsSaved:    w.IsSaved,
	}
}

func (runeq *WordSavingRequest) ToWord() Word {
	return Word{
		Origin:     runeq.Origin,
		SourceLang: runeq.SourceLang,
		Translated: runeq.Translated,
		TargetLang: runeq.TargetLang,
	}
}
