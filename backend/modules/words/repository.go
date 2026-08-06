package words

import (
	"context"
	"fmt"
	"log"

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
func (wr *WordRepository) Save(ctx context.Context, word Word) (Word, error) {
	var query = `
	INSERT INTO words ("user_id", "origin", "source_lang", "translated", "target_lang", "is_saved")
	VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING ` + wordColumns + `
	`

	currentUserId := ctx.Value("user_id").(string)
	var savedWord Word
	err := wr.pool.QueryRow(ctx, query, currentUserId, word.Origin, word.SourceLang, word.Translated, word.TargetLang, true).Scan(
		&savedWord.Id,
		&savedWord.UserId,
		&savedWord.Origin,
		&savedWord.SourceLang,
		&savedWord.Translated,
		&savedWord.TargetLang,
		&savedWord.createdAt,
		&savedWord.updatedAt,
		&savedWord.deletedAt,
		&savedWord.IsSaved,
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
	currentUserId := ctx.Value("user_id").(string)
	log.Println(currentUserId)
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
			&word.Id,
			&word.UserId,
			&word.Origin,
			&word.SourceLang,
			&word.Translated,
			&word.TargetLang,
			&word.createdAt,
			&word.updatedAt,
			&word.deletedAt,
			&word.IsSaved,
		)
		if err != nil {
			return nil, err
		}

		words = append(words, word)
	}

	return words, nil
}

func (wr *WordRepository) GetById(ctx context.Context, wordId string) (Word, error) {
	currentUserId := ctx.Value("user_id").(string)

	var query = `SELECT ` + wordColumns + ` FROM words WHERE user_id = $1 AND id = $2`

	var word Word
	err := wr.pool.QueryRow(ctx, query, currentUserId, wordId).Scan(
		&word.Id,
		&word.UserId,
		&word.Origin,
		&word.SourceLang,
		&word.Translated,
		&word.TargetLang,
		&word.createdAt,
		&word.updatedAt,
		&word.deletedAt,
		&word.IsSaved,
	)

	if err != nil {
		return Word{}, fmt.Errorf("words: error for get word %s: %w", wordId, err)
	}

	if word.UserId != currentUserId {
		return Word{}, ErrWordNotFound
	}

	return word, nil
}

func (wr *WordRepository) GetByUserId(ctx context.Context, userId string) ([]Word, error) {
	currentUserId := ctx.Value("user_id").(string)

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
			&word.Id,
			&word.UserId,
			&word.Origin,
			&word.SourceLang,
			&word.Translated,
			&word.TargetLang,
			&word.createdAt,
			&word.updatedAt,
			&word.deletedAt,
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
func (wr *WordRepository) Delete(ctx context.Context, wordId string) error {
	currentUserId := ctx.Value("user_id").(string)

	_, err := wr.GetById(ctx, wordId)
	if err != nil {
		return ErrWordNotFound
	}

	query := `UPDATE words SET deleted_at = NOW() WHERE id = $1 AND user_id = $2`

	tag, err := wr.pool.Exec(ctx, query, wordId, currentUserId)

	if err != nil {
		return ErrFailedToDelete
	}

	if tag.RowsAffected() == 0 {
		return ErrWordNotFound
	}

	return nil
}

func (wr *WordRepository) DeleteBulk(ctx context.Context, wordIds []string) error {
	query := `UPDATE words SET deleted_at = NOW() WHERE id = ANY($1) AND user_id = $2`

	currentUserId := ctx.Value("user_id").(string)

	tag, err := wr.pool.Exec(ctx, query, wordIds, currentUserId)

	if err != nil {
		return ErrFailedToDelete
	}

	if tag.RowsAffected() == 0 {
		return ErrWordNotFound
	}

	return nil
}
