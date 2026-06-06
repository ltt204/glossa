package words

import "glossa/internal/apperror"

var (
	// 4xx
	ErrWordNotFound    = apperror.New("WORD_NOT_FOUND", 404, "The requested word was not found.", nil)
	ErrInvalidWordData = apperror.New("INVALID_WORD_DATA", 400, "The provided word data is invalid.", nil)
	ErrFailedToDelete  = apperror.New("FAILED_TO_DELETE", 500, "Cannot delete the requested word", nil)

	// 5xx
	ErrDatabaseError = apperror.New("DATABASE_ERROR", 500, "An error occurred while accessing the database.", nil)
)
