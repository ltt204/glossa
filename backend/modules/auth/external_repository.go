package auth

import (
	"context"
	"glossa/modules/users"
)

type UserRepository interface {
	Save(ctx context.Context, req users.User) (users.User, error)
	GetByEmail(ctx context.Context, email string) (users.User, error)
	RemoveById(ctx context.Context, userId string) error
	UpdateById(ctx context.Context, user users.User) (users.User, error)
}
