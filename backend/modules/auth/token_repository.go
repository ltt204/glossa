package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"glossa/internal/apperror"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TokenRepository interface {
	Save(ctx context.Context, req CreateRefreshTokenRequest) (RefreshToken, error)
	RemoveAllByUserId(ctx context.Context, userId string) (bool, error)
	GenerateTokens(ctx context.Context, userID string) (string, string, error)
	GenerateAcccessTokens(ctx context.Context, refreshToken string) (string, string, error)
}

type tokenRepository struct {
	pool         *pgxpool.Pool
	jwtSecretKey []byte
}

func NewTokenRepository(pool *pgxpool.Pool, jwtSecretKey []byte) TokenRepository {
	return &tokenRepository{pool: pool, jwtSecretKey: jwtSecretKey}
}

func (refRepo *tokenRepository) Save(ctx context.Context, req CreateRefreshTokenRequest) (RefreshToken, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var refreshToken RefreshToken
	row := refRepo.pool.QueryRow(ctx, "INSERT INTO refresh_token (user_id, token_hash) VALUES ($1, $2) RETURNING id, user_id, token_hash, created_at, updated_at, deleted_at", req.UserId, req.TokenHash)
	if err := row.Scan(&refreshToken.ID, &refreshToken.UserID, &refreshToken.TokenHash, &refreshToken.CreatedAt, &refreshToken.UpdatedAt, &refreshToken.DeletedAt); err != nil {
		log.Println("Error[token_repository.save]: ", err)
		return RefreshToken{}, err
	}

	return refreshToken, nil
}

func (refRepo *tokenRepository) RemoveAllByUserId(ctx context.Context, userId string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	result, err := refRepo.pool.Exec(ctx, "DELETE FROM refresh_token WHERE user_id = $1", userId)
	if err != nil {
		return false, err
	}

	return result.RowsAffected() > 0, nil
}

func (refRepo *tokenRepository) GenerateTokens(ctx context.Context, userID string) (string, string, error) {
	// Access token (JWT, short-lived)
	claims := jwt.MapClaims{
		"sub": userID,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}
	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(refRepo.jwtSecretKey)
	if err != nil {
		return "", "", err
	}

	// Refresh token (hashed, long-lived)
	rawBytes := make([]byte, 32)
	if _, err := rand.Read(rawBytes); err != nil {
		return "", "", err
	}
	rawRefToken := hex.EncodeToString(rawBytes)

	hash := sha256.Sum256([]byte(rawRefToken))
	refreshToken := hex.EncodeToString(hash[:])

	_, err = refRepo.Save(ctx, CreateRefreshTokenRequest{
		UserId:    userID,
		TokenHash: refreshToken,
	})

	if err != nil {
		log.Println("Error[token_repository.generate_tokens]: ", err)
		return "", "", err
	}

	return accessToken, rawRefToken, nil
}

func (refRepo *tokenRepository) GenerateAcccessTokens(ctx context.Context, rawRefToken string) (string, string, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	hash := sha256.Sum256([]byte(rawRefToken))
	hashedRefreshToken := hex.EncodeToString(hash[:])

	var refreshTokenDO RefreshToken
	row := refRepo.pool.QueryRow(ctx, "SELECT * FROM refresh_token WHERE token_hash = $1", hashedRefreshToken)
	if err := row.Scan(&refreshTokenDO.ID, &refreshTokenDO.UserID, &refreshTokenDO.TokenHash, &refreshTokenDO.CreatedAt, &refreshTokenDO.UpdatedAt, &refreshTokenDO.DeletedAt); err != nil {
		log.Println("Error[token_repository.generate_access_tokens]: ", err)
		return "", "", apperror.InternalServerError.WithMessage("Something went wrong")
	}

	refRepo.RemoveAllByUserId(ctx, refreshTokenDO.UserID)
	accessToken, rawRefToken, err := refRepo.GenerateTokens(ctx, refreshTokenDO.UserID)

	if err != nil {
		return "", "", err
	}

	return accessToken, rawRefToken, nil
}
