package apperror

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type AppError struct {
	Code    string
	Message string
	Status  int
	Err     error
}

func New(code string, status int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Status:  status,
		Message: message,
		Err:     err,
	}
}

func NewAppError(err error) *AppError {
	if apperr, ok := err.(*AppError); ok {
		return apperr
	}
	return &AppError{
		Code:    "UNKNOWN",
		Status:  http.StatusInternalServerError,
		Message: "Unknown error.",
		Err:     err,
	}
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%s] %s: (%s)", e.Code, e.Message, e.Err.Error())
	}
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func (e *AppError) String() string {
	return e.Error()
}

func (e *AppError) WithErr(err error) *AppError {
	return &AppError{
		Code:    e.Code,
		Message: e.Message,
		Status:  e.Status,
		Err:     err,
	}
}

func (e *AppError) ToGinMap() gin.H {
	return gin.H{
		"status_code": e.Status,
		"error":       e.Error(),
		"timestamp":   time.Now(),
	}
}

func (e *AppError) WithMessage(msg string) *AppError {
	return &AppError{
		Code:    e.Code,
		Message: msg,
		Status:  e.Status,
		Err:     e.Err,
	}
}
