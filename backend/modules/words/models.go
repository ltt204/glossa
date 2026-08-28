package words

import "time"

type Word struct {
	ID     string
	UserID string

	Origin     string
	SourceLang string

	Translated string
	TargetLang string

	IsSaved bool

	CreatedAt time.Time
	UpdatedAt time.Time

	DeletedAt *time.Time
}
