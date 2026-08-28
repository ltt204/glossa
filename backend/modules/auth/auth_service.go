package auth

import (
	"context"
	"glossa/internal/apperror"
	"glossa/modules/users"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	authRepo  AuthRepository
	refRepo   TokenRepository
	converter users.UserConverter
}

func NewAuthService(authRepo AuthRepository, refRepo TokenRepository, converter users.UserConverter) *AuthService {
	return &AuthService{authRepo: authRepo, refRepo: refRepo, converter: converter}
}

func (us *AuthService) Signup(ctx context.Context, req SignupRequest) (SignupResponse, *apperror.AppError) {
	if req.Email == "" || req.Password == "" {
		return SignupResponse{}, apperror.ErrInvalidUserData.WithMessage(
			"Email and Password are required!",
		)
	}

	// If err is nil, means the query for getting user is successful, and thus the user is already existed
	_, err := us.authRepo.GetByEmail(ctx, req.Email)
	if err == nil {
		return SignupResponse{}, apperror.ErrEmailAlreadyExisted.WithMessage(
			"Email already exists!",
		)
	}

	createUserReq := users.CreateUserRequest(req)
	createUserReq.Password, err = us.hashPassword(createUserReq.Password)
	if err != nil {
		return SignupResponse{}, apperror.InternalServerError.WithMessage(err.Error())
	}

	user, err := us.authRepo.Signup(ctx, us.converter.ToEntity(createUserReq))
	if err != nil {
		return SignupResponse{}, apperror.InternalServerError.WithMessage(
			"Failed to create user!",
		)
	}

	accessToken, refreshToken, err := us.refRepo.GenerateTokens(ctx, user.ID)
	if err != nil {
		return SignupResponse{}, apperror.InternalServerError.WithMessage(
			"Failed to generate tokens!",
		)
	}

	return SignupResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         us.converter.ToDTO(user),
	}, nil
}

func (us *AuthService) Signin(ctx context.Context, req SigninRequest) (SigninResponse, *apperror.AppError) {
	if req.Email == "" || req.Password == "" {
		return SigninResponse{}, apperror.New(
			"BAD_REQUEST",
			http.StatusBadRequest,
			"Email and password are required",
			nil,
		)
	}

	accessToken, refreshToken, user, err := us.authRepo.Signin(ctx, req.Email, req.Password)

	if err != nil {
		return SigninResponse{}, apperror.NewAppError(err)
	}

	return SigninResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         us.converter.ToDTO(user),
	}, nil
}

func (us *AuthService) RefreshToken(ctx context.Context, req RefreshTokenRequest) (RefreshTokenResponse, *apperror.AppError) {
	if req.RefreshToken == "" {
		return RefreshTokenResponse{}, apperror.New(
			"BAD_REQUEST",
			http.StatusBadRequest,
			"Refresh token is required",
			nil,
		)
	}

	accessToken, refreshToken, err := us.refRepo.GenerateAcccessTokens(ctx, req.RefreshToken)
	if err != nil {
		apperr := apperror.NewAppError(err)
		return RefreshTokenResponse{}, apperr
	}

	return RefreshTokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (us *AuthService) Logout(ctx context.Context) (bool, *apperror.AppError) {
	userID := ctx.Value("user_id").(string)

	if userID == "" {
		return false, apperror.ErrInvalidUserData.WithMessage(
			"User ID is required!",
		)
	}

	ok, err := us.authRepo.Logout(ctx, userID)
	if err != nil {
		apperr := apperror.NewAppError(err)
		return false, apperr
	}

	return ok, nil
}

func (us *AuthService) hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return "", apperror.InternalServerError.WithMessage("Something went wrong.")
	}
	return string(bytes), nil
}
