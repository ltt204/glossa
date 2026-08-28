package words

//goverter:converter
//goverter:skipCopySameType
//goverter:output:file ./word_converter_gen.go
type WordConverter interface {
	ToDTOList(source []Word) []WordResponse

	//goverter:ignore ID
	ToDTO(source Word) WordResponse

	//goverter:ignore ID CreatedAt UpdatedAt DeletedAt UserID IsSaved
	ToEntity(source WordSavingRequest) Word
}
