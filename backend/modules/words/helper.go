package words

func (w *Word) ToResponse() WordResponse {
	return WordResponse{
		ID:         w.Id,
		UserId:     w.UserId,
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
		SourceLang: runeq.Source,
		Translated: runeq.Translated,
		TargetLang: runeq.Target,
	}
}
