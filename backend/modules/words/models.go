package words

import "time"

type Word struct {
	Id     string
	UserId string

	Origin     string
	SourceLang string

	Translated string
	TargetLang string

	IsSaved bool

	createdAt time.Time
	updatedAt time.Time

	deletedAt *time.Time
}
