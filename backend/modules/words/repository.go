package words

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

const wordColumns = `id, user_id, origin, source_lang, translated, target_lang, created_at, updated_at, deleted_at, is_saved`

type WordRepository struct {
	pool *pgxpool.Pool
}

func NewWordRepository(pool *pgxpool.Pool) *WordRepository {
	return &WordRepository{pool: pool}
}

// CREATE
// Working on splitting create and update operation
func (wr *WordRepository) Save(ctx context.Context, word Word, currentUserId string) (Word, error) {
	var query = `
	INSERT INTO words ("user_id", "origin", "source_lang", "translated", "target_lang", "is_saved")
	VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING ` + wordColumns + `
	`

	var savedWord Word
	err := wr.pool.QueryRow(ctx, query, currentUserId, word.Origin, word.SourceLang, word.Translated, word.TargetLang, true).Scan(
		&savedWord.ID,
		&savedWord.UserID,
		&savedWord.Origin,
		&savedWord.SourceLang,
		&savedWord.Translated,
		&savedWord.TargetLang,
		&savedWord.CreatedAt,
		&savedWord.UpdatedAt,
		&savedWord.DeletedAt,
		&savedWord.IsSaved,
	)

	if err != nil {
		return Word{}, fmt.Errorf("failed to insert word: %w", err)
	}
	return savedWord, nil
}

// UPDATE
func (wr *WordRepository) Update(ctx context.Context, word Word, currentUserId string) (string, error) {
	return "", fmt.Errorf("not implemented")
}

// READ
func (wr *WordRepository) GetAll(ctx context.Context, currentUserId string) ([]Word, error) {
	var query = `SELECT ` + wordColumns + ` FROM words WHERE user_id = $1 AND (deleted_at IS NULL AND is_saved = true)`

	result, err := wr.pool.Query(ctx, query, currentUserId)
	if err != nil {
		return []Word{}, err
	}
	defer result.Close()

	words := make([]Word, 0)
	for result.Next() {
		var word Word
		err = result.Scan(
			&word.ID,
			&word.UserID,
			&word.Origin,
			&word.SourceLang,
			&word.Translated,
			&word.TargetLang,
			&word.CreatedAt,
			&word.UpdatedAt,
			&word.DeletedAt,
			&word.IsSaved,
		)
		if err != nil {
			return nil, err
		}

		words = append(words, word)
	}

	return words, nil
}

func (wr *WordRepository) GetById(ctx context.Context, wordId string, currentUserId string) (Word, error) {
	var query = `SELECT ` + wordColumns + ` FROM words WHERE user_id = $1 AND id = $2`

	var word Word
	err := wr.pool.QueryRow(ctx, query, currentUserId, wordId).Scan(
		&word.ID,
		&word.UserID,
		&word.Origin,
		&word.SourceLang,
		&word.Translated,
		&word.TargetLang,
		&word.CreatedAt,
		&word.UpdatedAt,
		&word.DeletedAt,
		&word.IsSaved,
	)

	if err != nil {
		return Word{}, fmt.Errorf("words: error for get word %s: %w", wordId, err)
	}

	if word.UserID != currentUserId {
		return Word{}, ErrWordNotFound
	}

	return word, nil
}

func (wr *WordRepository) GetByUserId(ctx context.Context, currentUserId string) ([]Word, error) {
	var query = `SELECT ` + wordColumns + ` FROM words WHERE user_id = $1`

	result, err := wr.pool.Query(ctx, query, currentUserId)
	if err != nil {
		return []Word{}, err
	}
	defer result.Close()

	words := make([]Word, 0)
	for result.Next() {
		var word Word
		err = result.Scan(
			&word.ID,
			&word.UserID,
			&word.Origin,
			&word.SourceLang,
			&word.Translated,
			&word.TargetLang,
			&word.CreatedAt,
			&word.UpdatedAt,
			&word.DeletedAt,
			&word.IsSaved,
		)
		if err != nil {
			return nil, err
		}

		words = append(words, word)
	}

	return words, nil

}

// DELETE
func (wr *WordRepository) Delete(ctx context.Context, wordId string, currentUserId string) error {
	_, err := wr.GetById(ctx, wordId, currentUserId)
	if err != nil {
		return ErrWordNotFound
	}

	query := `UPDATE words SET
		deleted_at = NOW(), is_saved = false
		WHERE id = $1 AND user_id = $2`

	tag, err := wr.pool.Exec(ctx, query, wordId, currentUserId)

	if err != nil {
		return ErrFailedToDelete
	}

	if tag.RowsAffected() == 0 {
		return ErrWordNotFound
	}

	return nil
}

func (wr *WordRepository) DeleteBulk(ctx context.Context, wordIds []string, currentUserId string) error {
	query := `UPDATE words SET deleted_at = NOW() WHERE id = ANY($1) AND user_id = $2`

	tag, err := wr.pool.Exec(ctx, query, wordIds, currentUserId)

	if err != nil {
		return ErrFailedToDelete
	}

	if tag.RowsAffected() == 0 {
		return ErrWordNotFound
	}

	return nil
}
