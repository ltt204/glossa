package words

type WordSavingRequest struct {
	Origin string
	Source string

	Translated string
	Target     string
}

func (runeq *WordSavingRequest) ToWord() Word {
	return Word{
		Origin:     runeq.Origin,
		SourceLang: runeq.Source,
		Translated: runeq.Translated,
		TargetLang: runeq.Target,
	}
}

type WordGettingResponse struct {
	Origin string
	Source string

	Translated string
	Target     string
}
