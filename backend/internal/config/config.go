package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	BaseUrl string

	AllowOrigins []string
}

func Load() (*Config, error) {
	// Env
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("Error loading .env file: %w", err)
	}

	baseUrl := os.Getenv("BASE_URL")
	if baseUrl == "" {
		baseUrl = "localhost:8000"
	}

	allowOrigins := strings.Split(os.Getenv("ALLOW_ORIGINS"), ",")

	if len(allowOrigins) == 0 {
		allowOrigins = []string{"http://localhost:3000"}
	}

	return &Config{
		baseUrl, allowOrigins,
	}, nil
}
