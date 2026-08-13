package auth

import "time"

type RefreshToken struct {
	ID        string     `db:"id"`
	UserID    string     `db:"userId"`
	TokenHash string     `db:"tokenHash"`
	CreatedAt time.Time  `db:"createdAt"`
	UpdatedAt time.Time  `db:"updatedAt"`
	DeletedAt *time.Time `db:"deletedAt"`
}
