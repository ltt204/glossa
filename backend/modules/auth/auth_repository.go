package auth

import (
	"context"
	"glossa/internal/apperror"
	"glossa/modules/users"
	"log"

	"golang.org/x/crypto/bcrypt"
)

type AuthRepository interface {
	Signup(ctx context.Context, req users.User) (users.User, error)
	Signin(ctx context.Context, email string, password string) (string, string, users.User, error)
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

func (authRepo *authRepository) Signup(ctx context.Context, req users.User) (users.User, error) {
	user, err := authRepo.userRepo.Save(ctx, req)
	if err != nil {
		log.Println("Error[auth_repository.signup]: ", err)
		return users.User{}, apperror.InternalServerError.WithMessage("Something went wrong.")
	}

	return user, nil
}

func (authRepo *authRepository) GetByEmail(ctx context.Context, email string) (users.User, error) {
	return authRepo.userRepo.GetByEmail(ctx, email)
}

func (authRepo *authRepository) Signin(ctx context.Context, email string, password string) (string, string, users.User, error) {
	user, err := authRepo.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return "", "", users.User{}, apperror.ErrResourceNotFound.WithMessage("User not found.")
	}

	if user.DeletedAt != nil {
		return "", "", users.User{}, apperror.ErrResourceNotFound.WithMessage("User not found.")
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", "", users.User{}, apperror.ErrUnauthorized.WithMessage("Invalid credentials.")
	}

	accessToken, refreshToken, err := authRepo.refRepo.GenerateTokens(ctx, user.ID)
	if err != nil {
		return "", "", users.User{}, apperror.ErrFailedToCreate.WithMessage(err.Error())
	}

	return accessToken, refreshToken, user, nil
}

func (authRepo *authRepository) Logout(ctx context.Context, userID string) (bool, error) {
	return authRepo.refRepo.RemoveAllByUserId(ctx, userID)
}
