package words

import (
	"context"
	"glossa/internal/apperror"
	"log"
)

type WordService struct {
	Wr        *WordRepository
	converter WordConverter
}

func NewWordService(wr *WordRepository, converter WordConverter) *WordService {
	return &WordService{Wr: wr, converter: converter}
}

func (ws *WordService) Save(ctx context.Context, word Word, currentUserId string) (WordResponse, *apperror.AppError) {
	word, err := ws.Wr.Save(ctx, word, currentUserId)

	if err != nil {
		log.Println("[WORD-MODULE] Save error: ", err)
		return WordResponse{}, apperror.InternalServerError.WithMessage("Failed to save word")
	}
	return word.ToResponse(), nil
}

func (ws *WordService) GetAll(ctx context.Context, currentUserId string) ([]WordResponse, *apperror.AppError) {
	words, err := ws.Wr.GetAll(ctx, currentUserId)
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

func (ws *WordService) GetById(ctx context.Context, wordId string, currentUserId string) (WordResponse, error) {
	word, err := ws.Wr.GetById(ctx, wordId, currentUserId)
	if err != nil {
		return WordResponse{}, err
	}
	return word.ToResponse(), nil
}

func (ws *WordService) GetByUserId(ctx context.Context, currentUserId string) ([]WordResponse, error) {
	words, err := ws.Wr.GetByUserId(ctx, currentUserId)
	if err != nil {
		return []WordResponse{}, err
	}
	var res []WordResponse
	for _, word := range words {
		res = append(res, word.ToResponse())
	}
	return res, nil
}

func (ws *WordService) Delete(ctx context.Context, wordId string, currentUserId string) *apperror.AppError {
	err := ws.Wr.Delete(ctx, wordId, currentUserId)
	if err != nil {
		log.Println("[WORD-MODULE] Delete error: ", err)
		return apperror.InternalServerError.WithMessage("Failed to delete word")
	}
	return nil
}

func (ws *WordService) DeleteBulk(ctx context.Context, wordIds []string, currentUserId string) *apperror.AppError {
	err := ws.Wr.DeleteBulk(ctx, wordIds, currentUserId)
	if err != nil {
		log.Println("[WORD-MODULE] DeleteBulk error: ", err)
		return apperror.InternalServerError.WithMessage("Failed to delete words")
	}
	return nil
}
