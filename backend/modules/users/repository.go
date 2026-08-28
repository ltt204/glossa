package users

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (ur *UserRepository) Save(ctx context.Context, req User) (User, error) {

	var savedUser User
	err := ur.pool.QueryRow(ctx, `INSERT INTO users (id, email, password_hash) VALUES (gen_random_uuid(), $1, $2) RETURNING *`, req.Email, req.Password).Scan(
		&savedUser.ID,
		&savedUser.Email,
		&savedUser.Password,
		&savedUser.CreatedAt,
		&savedUser.UpdatedAt,
		&savedUser.DeletedAt,
	)

	if err != nil {
		return User{}, err
	}

	return savedUser, nil
}

func (ur *UserRepository) GetByEmail(ctx context.Context, email string) (User, error) {
	var query string = `SELECT * FROM users WHERE email = $1`
	var user User
	err := ur.pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.DeletedAt,
	)
	if err != nil {
		return User{}, err
	}
	return user, nil
}

func (ur *UserRepository) RemoveById(ctx context.Context, userId string) error {
	return ur.RemoveById(ctx, userId)
}

func (ur *UserRepository) UpdateById(ctx context.Context, user User) (User, error) {
	return ur.UpdateById(ctx, user)
}
