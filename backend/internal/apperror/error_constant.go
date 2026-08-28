package apperror

import "net/http"

var (
	// Common
	ErrFailedToCreate = &AppError{
		Code:    "FAILED_TO_CREATE",
		Message: "Failed to create.",
		Status:  http.StatusInternalServerError,
	}

	TimeoutError = &AppError{
		Code:    "TIMEOUT_ERROR",
		Message: "Request timed out.",
		Status:  http.StatusGatewayTimeout,
	}

	InternalServerError = &AppError{
		Code:    "INTERNAL_SERVER_ERROR",
		Message: "Internal server error.",
		Status:  http.StatusInternalServerError,
	}

	ErrResourceNotFound = &AppError{
		Code:    "RESOURCE_NOT_FOUND",
		Message: "Resource not found.",
		Status:  http.StatusNotFound,
	}

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

	// User error
	ErrInvalidUserData = &AppError{
		Code:    "INVALID_USER_DATA",
		Message: "The provided user data is invalid.",
		Status:  http.StatusBadRequest,
	}

	ErrEmailAlreadyExisted = &AppError{
		Code:    "EMAIL_ALREADY_EXISTED",
		Message: "The provided email already existed.",
		Status:  http.StatusConflict,
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

	// Auth Error
	ErrUnauthorized = &AppError{
		Code:    "UNAUTHORIZED",
		Message: "Unauthorized.",
		Status:  http.StatusUnauthorized,
	}
)
