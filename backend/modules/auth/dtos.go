package auth

import "glossa/modules/users"

type SignupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type SigninRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type SignupResponse struct {
	AccessToken  string     `json:"access_token"`
	RefreshToken string     `json:"refresh_token"`
	User         users.User `json:"user"`
}

type SigninResponse struct {
	AccessToken  string             `json:"access_token"`
	RefreshToken string             `json:"refresh_token"`
	User         users.UserResponse `json:"user"`
}

// REFRESH TOKEN DTOs
type RevokeAllRefreshTokensRequest struct {
	UserId string `json:"user_id" binding:"required"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type CreateRefreshTokenRequest struct {
	UserId    string `json:"user_id" binding:"required"`
	TokenHash string `json:"token_hash" binding:"required"`
}

// Success Response Wrappers for Swagger
type SignupSuccessWrapper struct {
	Message string         `json:"message" example:"User created successfully"`
	User    SignupResponse `json:"user"`
}

type SigninSuccessWrapper struct {
	Message string         `json:"message" example:"User signed in successfully"`
	User    SigninResponse `json:"user"`
}

type RefreshTokenSuccessWrapper struct {
	Message string               `json:"message" example:"User signed in successfully"`
	User    RefreshTokenResponse `json:"user"`
}

type LogoutSuccessWrapper struct {
	Message string `json:"message" example:"User signed out successfully"`
	User    bool   `json:"user" example:"true"`
}
