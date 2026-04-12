package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	BaseUrl          string
	AllowOrigins     []string
	ConnectionString string
}

func Load() (*Config, error) {
	// Env
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	baseUrl := os.Getenv("BASE_URL")
	if baseUrl == "" {
		baseUrl = "localhost:8000"
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

	return &Config{
		baseUrl, allowOrigins, connectionString,
	}, nil
}
