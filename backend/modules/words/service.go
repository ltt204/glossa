package words

import "context"

type WordService struct {
	Wr *WordRepository
}

func NewWordService(wr *WordRepository) *WordService {
	return &WordService{Wr: wr}
}

func (ws *WordService) Save(ctx context.Context, word Word) (Word, error) {
	return ws.Wr.Save(ctx, word)
}

func (ws *WordService) GetAll(ctx context.Context) ([]Word, error) {
	return ws.Wr.GetAll(ctx)
}

func (ws *WordService) GetById(ctx context.Context, wordId string) (Word, error) {
	return ws.Wr.GetById(ctx, wordId)
}

func (ws *WordService) GetByUserId(ctx context.Context, userId string) ([]Word, error) {
	return ws.Wr.GetByUserId(ctx, userId)
}

func (ws *WordService) Delete(ctx context.Context, wordId string) error {
	return ws.Wr.Delete(ctx, wordId)
}

func (ws *WordService) DeleteBulk(ctx context.Context, wordIds []string) error {
	return ws.Wr.DeleteBulk(ctx, wordIds)
}
