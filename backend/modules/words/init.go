package words

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(connectionPool *pgxpool.Pool) *WordsHandler {

	wordRepo := NewWordRepository(connectionPool)
	wConverter := WordConverterImpl{}
	wordSvc := NewWordService(wordRepo, &wConverter)
	return NewHandler(wordSvc)
}
