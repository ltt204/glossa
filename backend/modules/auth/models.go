package auth

import "time"

type RefreshToken struct {
	ID        string     `db:"id"`
	UserID    string     `db:"user_id"`
	TokenHash string     `db:"token_hash"`
	CreatedAt time.Time  `db:"created_at"`
	UpdatedAt time.Time  `db:"updated_at"`
	DeletedAt *time.Time `db:"deleted_at"`
}
