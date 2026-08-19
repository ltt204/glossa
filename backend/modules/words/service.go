package words

import (
	"context"
	"glossa/internal/apperror"
	"log"
)

type WordService struct {
	Wr *WordRepository
}

func NewWordService(wr *WordRepository) *WordService {
	return &WordService{Wr: wr}
}

func (ws *WordService) Save(ctx context.Context, word Word) (WordResponse, *apperror.AppError) {
	word, err := ws.Wr.Save(ctx, word)

	if err != nil {
		log.Println("[WORD-MODULE] Save error: ", err)
		return WordResponse{}, apperror.InternalServerError.WithMessage("Failed to save word")
	}
	return word.ToResponse(), nil
}

func (ws *WordService) GetAll(ctx context.Context) ([]WordResponse, *apperror.AppError) {
	words, err := ws.Wr.GetAll(ctx)
	if err != nil {
		log.Println("[WORD-MODULE] GetAll error: ", err)
		return []WordResponse{}, apperror.InternalServerError.WithMessage("Failed to get words")
	}
	var res []WordResponse = make([]WordResponse, 0, len(words))
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

func (ws *WordService) Delete(ctx context.Context, wordId string) *apperror.AppError {
	err := ws.Wr.Delete(ctx, wordId)
	if err != nil {
		log.Println("[WORD-MODULE] Delete error: ", err)
		return apperror.InternalServerError.WithMessage("Failed to delete word")
	}
	return nil
}

func (ws *WordService) DeleteBulk(ctx context.Context, wordIds []string) *apperror.AppError {
	err := ws.Wr.DeleteBulk(ctx, wordIds)
	if err != nil {
		log.Println("[WORD-MODULE] DeleteBulk error: ", err)
		return apperror.InternalServerError.WithMessage("Failed to delete words")
	}
	return nil
}
