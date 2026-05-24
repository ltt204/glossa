package apperror

import "net/http"

var (
	// Translation error
	FailedTranslateWord = &AppError{
		Code:    "FAILED_TRANSLATE_WORD",
		Message: "Failed to translate word.",
		Status:  http.StatusInternalServerError,
	}
	// Word Query Error
	ErrWordNotFound = &AppError{
		Code:    "WORD_NOT_FOUND",
		Message: "The requested word was not found.",
		Status:  http.StatusNotFound,
	}
	ErrInvalidWordData = &AppError{
		Code:    "INVALID_WORD_DATA",
		Message: "The provided word data is invalid.",
		Status:  http.StatusBadRequest,
	}

	// Google Client Error
	FailedCreateGoogleClient = &AppError{
		Code:    "FAILED_CREATE_GOOGLE_CLIENT",
		Message: "Failed to create Google client.",
		Status:  http.StatusInternalServerError,
	}

	FailedCloseGoogleClient = &AppError{
		Code:    "FAILED_CLOSE_GOOGLE_CLIENT",
		Message: "Failed to close Google client.",
		Status:  http.StatusInternalServerError,
	}

	// JSON error
	ErrBadJsonStructure = &AppError{
		Code:    "BAD_JSON_STRUCTURE",
		Message: "The provided JSON structure is invalid.",
		Status:  http.StatusBadRequest,
	}
)
