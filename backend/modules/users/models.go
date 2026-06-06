package users

import "time"

type User struct {
	ID        string    `db:"id"`            // UUID
	Email     string    `db:"email"`         // NOT NULL UNIQUE
	Password  string    `db:"password_hash"` // NOT NULL
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
	DeletedAt *time.Time
}
