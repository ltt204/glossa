package words

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

const wordColumns = `id, user_id, origin, source_lang, translated, target_lang, created_at, updated_at, deleted_at`

type WordRepository struct {
	pool *pgxpool.Pool
}

func NewWordRepository(pool *pgxpool.Pool) *WordRepository {
	return &WordRepository{pool: pool}
}

// CREATE
// Working on splitting create and update operation
func (wr *WordRepository) Save(ctx context.Context, word Word) (Word, error) {
	var query = `
	INSERT INTO words ("user_id", "origin", "source_lang", "translated", "target_lang")
	VALUES ($1, $2, $3, $4, $5)
	RETURNING ` + wordColumns + `
	`

	var savedWord Word
	err := wr.pool.QueryRow(ctx, query, "00000000-0000-0000-0000-000000000001", word.Origin, word.SourceLang, word.Translated, word.TargetLang).Scan(
		&savedWord.Id,
		&savedWord.UserId,
		&savedWord.Origin,
		&savedWord.SourceLang,
		&savedWord.Translated,
		&savedWord.TargetLang,
		&savedWord.createdAt,
		&savedWord.updatedAt,
		&savedWord.deletedAt,
	)

	if err != nil {
		return Word{}, fmt.Errorf("failed to insert word: %w", err)
	}
	return savedWord, nil
}

// UPDATE
func (wr *WordRepository) Update(ctx context.Context, word Word) (string, error) {
	return "", fmt.Errorf("not implemented")
}

// READ
func (wr *WordRepository) GetAll(ctx context.Context) ([]Word, error) {
	var query = `SELECT ` + wordColumns + ` FROM words`

	result, err := wr.pool.Query(ctx, query)
	if err != nil {
		return []Word{}, err
	}
	defer result.Close()

	var words []Word
	for result.Next() {
		var word Word
		err = result.Scan(
			&word.Id,
			&word.UserId,
			&word.Origin,
			&word.SourceLang,
			&word.Translated,
			&word.TargetLang,
			&word.createdAt,
			&word.updatedAt,
			&word.deletedAt,
		)
		if err != nil {
			return nil, err
		}
		words = append(words, word)
	}

	return words, nil
}

func (wr *WordRepository) GetById(ctx context.Context, wordId string) (Word, error) {
	query := `SELECT ` + wordColumns + ` FROM words
		WHERE id = $1
	`

	var word Word
	err := wr.pool.QueryRow(ctx, query, wordId).Scan(
		&word.Id,
		&word.UserId,
		&word.Origin,
		&word.SourceLang,
		&word.Translated,
		&word.TargetLang,
		&word.createdAt,
		&word.updatedAt,
		&word.deletedAt,
	)

	if err != nil {
		return Word{}, fmt.Errorf("words: error for get word %s: %w", wordId, err)
	}

	return word, nil
}

func (wr *WordRepository) GetByUserId(ctx context.Context, userId string) ([]Word, error) {
	return nil, fmt.Errorf("not implemented")

}

// DELETE
func (wr *WordRepository) Delete(ctx context.Context, wordId string) error {
	query := `DELETE FROM words WHERE id =$1`

	tag, err := wr.pool.Exec(ctx, query, wordId)

	if err != nil {
		return ErrFailedToDelete
	}

	if tag.RowsAffected() == 0 {
		return ErrWordNotFound
	}

	return nil
}

func (wr *WordRepository) DeleteBulk(ctx context.Context, wordIds []string) error {
	query := `DELETE FROM words WHERE id = ANY($1)`

	_, err := wr.pool.Exec(ctx, query, wordIds)

	if err != nil {
		return ErrFailedToDelete
	}

	return nil
}
