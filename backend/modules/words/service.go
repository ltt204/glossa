package words

import "context"

type WordService struct {
	Wr *WordRepository
}

func NewWordService(wr *WordRepository) *WordService {
	return &WordService{Wr: wr}
}

func (ws *WordService) Save(ctx context.Context, word Word) (WordResponse, error) {
	word, err := ws.Wr.Save(ctx, word)

	if err != nil {
		return WordResponse{}, err
	}
	return word.ToResponse(), nil
}

func (ws *WordService) GetAll(ctx context.Context) ([]WordResponse, error) {
	words, err := ws.Wr.GetAll(ctx)
	if err != nil {
		return []WordResponse{}, err
	}
	var res []WordResponse
	for _, word := range words {
		res = append(res, word.ToResponse())
	}
	return res, nil
}

func (ws *WordService) GetById(ctx context.Context, wordId string) (WordResponse, error) {
	word, err := ws.Wr.GetById(ctx, wordId)
	if err != nil {
		return WordResponse{}, err
	}
	return word.ToResponse(), nil
}

func (ws *WordService) GetByUserId(ctx context.Context, userId string) ([]WordResponse, error) {
	words, err := ws.Wr.GetByUserId(ctx, userId)
	if err != nil {
		return []WordResponse{}, err
	}
	var res []WordResponse
	for _, word := range words {
		res = append(res, word.ToResponse())
	}
	return res, nil
}

func (ws *WordService) Delete(ctx context.Context, wordId string) error {
	return ws.Wr.Delete(ctx, wordId)
}

func (ws *WordService) DeleteBulk(ctx context.Context, wordIds []string) error {
	return ws.Wr.DeleteBulk(ctx, wordIds)
}
