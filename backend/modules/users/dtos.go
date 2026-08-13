package users

import "time"

// DTO - For HTTP Layers

type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserResponse struct {
	ID        string     `json:"id"`
	Email     string     `json:"email"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"` // omitempty omits the field if it is nil
}
