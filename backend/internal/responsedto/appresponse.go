package responsedto

import (
	"glossa/internal/apperror"
	"time"
)

type ApplicationResponse struct {
	Success   bool      `json:"success"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Content   any       `json:"content"`
}

func SuccessResponse(message string, content any) *ApplicationResponse {
	return &ApplicationResponse{
		Success:   true,
		Message:   message,
		Timestamp: time.Now(),
		Content:   content,
	}
}

func (appRes *ApplicationResponse) ToGinMap() map[string]any {
	return map[string]any{
		"success":   appRes.Success,
		"message":   appRes.Message,
		"timestamp": appRes.Timestamp,
		"content":   appRes.Content,
	}
}

type ApplicationErrorResponse struct {
	Success   bool      `json:"success"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	ErrorCode string    `json:"error_code"`
}

func ErrorResponse(appError *apperror.AppError) ApplicationErrorResponse {
	return ApplicationErrorResponse{
		Success:   false,
		Message:   appError.Message,
		Timestamp: time.Now(),
		ErrorCode: appError.Code,
	}
}
