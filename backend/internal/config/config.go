package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	BaseUrl          string
	AllowOrigins     []string
	ConnectionString string
	JwtSecret        string
	DictApi          string
	ProjectID        string
}

func Load() (*Config, error) {
	godotenv.Load()

	baseUrl := os.Getenv("BASE_URL")
	if baseUrl == "" {
		baseUrl = ":8000"
	}

	raw := os.Getenv("ALLOW_ORIGINS")
	var allowOrigins []string
	if raw == "" {
		allowOrigins = []string{"http://localhost:3000"}
	} else {
		allowOrigins = strings.Split(raw, ",")
	}

	connectionString := os.Getenv("CONNECTION_STRING")
	if connectionString == "" {
		connectionString = "postgres://postgres:postgres@localhost:5432/glossa?sslmode=disable"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-me"
	}

	passwdSalt := os.Getenv("PASSWORD_SALT")
	if passwdSalt == "" {
		passwdSalt = "dev-salt-change-me"
	}

	dictApi := os.Getenv("DICTIONARY_API_BASE_URL")
	if dictApi == "" {
		dictApi = "https://api.dictionaryapi.dev/api/v2/entries/en/"
	}

	projectId := os.Getenv("PROJECT_ID")
	if projectId == "" {
		projectId = "glossa"
	}

	return &Config{
		BaseUrl:          baseUrl,
		AllowOrigins:     allowOrigins,
		ConnectionString: connectionString,
		JwtSecret:        jwtSecret,
		DictApi:          dictApi,
		ProjectID:        projectId,
	}, nil
}
