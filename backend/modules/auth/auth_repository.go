package auth

import (
	"context"
	"glossa/internal/apperror"
	"glossa/modules/users"

	"golang.org/x/crypto/bcrypt"
)

type AuthRepository interface {
	Signup(ctx context.Context, req users.CreateUserRequest) (users.User, error)
	Signin(ctx context.Context, req SigninRequest) (SigninResponse, error)
	RefreshToken(ctx context.Context, req RefreshTokenRequest) (string, string, error)
	Logout(ctx context.Context, userID string) (bool, error)
	GetByEmail(ctx context.Context, email string) (users.User, error)
}

type authRepository struct {
	userRepo UserRepository
	refRepo  TokenRepository
}

func NewAuthRepository(userRepo UserRepository, refRepo TokenRepository) AuthRepository {
	return &authRepository{userRepo: userRepo, refRepo: refRepo}
}

func (authRepo *authRepository) Signup(ctx context.Context, req users.CreateUserRequest) (users.User, error) {
	user, err := authRepo.userRepo.Save(ctx, req)
	if err != nil {
		return users.User{}, apperror.InternalServerError.WithMessage("Something went wrong.")
	}

	return user, nil
}

func (authRepo *authRepository) GetByEmail(ctx context.Context, email string) (users.User, error) {
	return authRepo.userRepo.GetByEmail(ctx, email)
}

func (authRepo *authRepository) Signin(ctx context.Context, req SigninRequest) (SigninResponse, error) {
	user, err := authRepo.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return SigninResponse{}, apperror.ErrResourceNotFound.WithMessage("User not found.")
	}

	if user.DeletedAt != nil {
		return SigninResponse{}, apperror.ErrResourceNotFound.WithMessage("User not found.")
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return SigninResponse{}, apperror.ErrUnauthorized.WithMessage("Invalid credentials.")
	}

	accessToken, refreshToken, err := authRepo.refRepo.GenerateTokens(ctx, user.ID)
	if err != nil {
		return SigninResponse{}, apperror.ErrFailedToCreate
	}

	return SigninResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         users.ToDto(user),
	}, nil
}

func (authRepo *authRepository) RefreshToken(ctx context.Context, req RefreshTokenRequest) (string, string, error) {
	accessToken, refreshToken, err := authRepo.refRepo.GenerateAcccessTokens(ctx, req.RefreshToken)
	if err != nil {
		return "", "", apperror.ErrUnauthorized.WithMessage("Token is invalid or expired.")
	}

	return accessToken, refreshToken, nil
}

func (authRepo *authRepository) Logout(ctx context.Context, userID string) (bool, error) {
	return authRepo.refRepo.RemoveAllByUserId(ctx, userID)
}
