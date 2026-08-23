export interface AppError {
	code: string
	message: string
	status: number
}

// Common
export const ErrFailedToCreate: AppError = {
	code: 'FAILED_TO_CREATE',
	message: 'Failed to create.',
	status: 500,
}

export const TimeoutError: AppError = {
	code: 'TIMEOUT_ERROR',
	message: 'Request timed out.',
	status: 504,
}

export const InternalServerError: AppError = {
	code: 'INTERNAL_SERVER_ERROR',
	message: 'Internal server error.',
	status: 500,
}

export const ErrResourceNotFound: AppError = {
	code: 'RESOURCE_NOT_FOUND',
	message: 'Resource not found.',
	status: 404,
}

// Translation error
export const FailedTranslateWord: AppError = {
	code: 'FAILED_TRANSLATE_WORD',
	message: 'Failed to translate word.',
	status: 500,
}

// Word Query Error
export const ErrWordNotFound: AppError = {
	code: 'WORD_NOT_FOUND',
	message: 'The requested word was not found.',
	status: 404,
}

export const ErrInvalidWordData: AppError = {
	code: 'INVALID_WORD_DATA',
	message: 'The provided word data is invalid.',
	status: 400,
}

// User error
export const ErrInvalidUserData: AppError = {
	code: 'INVALID_USER_DATA',
	message: 'The provided user data is invalid.',
	status: 400,
}

export const ErrEmailAlreadyExisted: AppError = {
	code: 'EMAIL_ALREADY_EXISTED',
	message: 'The provided email already existed.',
	status: 409,
}

// Google Client Error
export const FailedCreateGoogleClient: AppError = {
	code: 'FAILED_CREATE_GOOGLE_CLIENT',
	message: 'Failed to create Google client.',
	status: 500,
}

export const FailedCloseGoogleClient: AppError = {
	code: 'FAILED_CLOSE_GOOGLE_CLIENT',
	message: 'Failed to close Google client.',
	status: 500,
}

// JSON error
export const ErrBadJsonStructure: AppError = {
	code: 'BAD_JSON_STRUCTURE',
	message: 'The provided JSON structure is invalid.',
	status: 400,
}

// Auth Error
export const ErrUnauthorized: AppError = {
	code: 'UNAUTHORIZED',
	message: 'Unauthorized.',
	status: 401,
}

// Combined dictionary for lookup
export const APP_ERRORS = {
	ErrFailedToCreate,
	TimeoutError,
	InternalServerError,
	ErrResourceNotFound,
	FailedTranslateWord,
	ErrWordNotFound,
	ErrInvalidWordData,
	ErrInvalidUserData,
	ErrEmailAlreadyExisted,
	FailedCreateGoogleClient,
	FailedCloseGoogleClient,
	ErrBadJsonStructure,
	ErrUnauthorized,
} as const

// Helper to look up an error by code
export function getAppErrorByCode(code: string): AppError | undefined {
	return Object.values(APP_ERRORS).find((err) => err.code === code)
}
