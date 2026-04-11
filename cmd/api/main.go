package main

import (
	"context"
	"glossa/internal/modules/translator"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	ctx := context.Background()

	// Env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	ggclient, err := translator.NewGoogleClient(ctx)
	if err != nil {

	}

	translationSvc, err := translator.NewTranslationService(ggclient)
	handler := translator.NewHandler(translationSvc)

	r := gin.Default()
	baseUrl := os.Getenv("BASE_URL")
	if baseUrl == "" {
		baseUrl = "localhost:8000"
	}

	api := r.Group("/api")

	handler.RegisterRoute(api)

	r.Run(baseUrl)
}
