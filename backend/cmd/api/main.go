package main

import (
	"context"
	"glossa/modules/translator"
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
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

	allowOrigins := strings.Split(os.Getenv("ALLOW_ORIGINS"), ",")

	if len(allowOrigins) == 0 {
		allowOrigins = []string{"http://localhost:3000"}
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // 12 hours
	}))

	api := r.Group("/api")

	handler.RegisterRoute(api)

	r.Run(baseUrl)
}
