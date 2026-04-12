package words

import "errors"

var (
	// 4xx
	ErrWordNotFound    = errors.New("WORD_NOT_FOUND: The requested word was not found.")
	ErrInvalidWordData = errors.New("INVALID_WORD_DATA: The provided word data is invalid.")
	ErrFailedToDelete  = errors.New("FAILED_TO_DELETE: Cannot delete the requested word")

	// 5xx
	ErrDatabaseError = errors.New("DATABASE_ERROR: An error occurred while accessing the database.")
)
