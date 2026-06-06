package main

import (
	"context"
	"glossa/internal/config"
	"glossa/internal/db"
	"glossa/modules/auth"
	"glossa/modules/translator"
	"glossa/modules/users"
	"glossa/modules/words"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	ctx := context.Background()
	ggclient, err := translator.NewGoogleClient(ctx)
	if err != nil {
		log.Fatal("Failed to initialize translation client: ", err)
	}

	appConfig, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load app config: ", err)
	}

	connectionPool, err := db.Connect(appConfig.ConnectionString)

	if err != nil {
		log.Fatal("Failed to establish connection with database: ", err)
	}

	// Executes (Closed the connection) when the surrounding function (main --> application is stoped) returns
	defer connectionPool.Close()

	wordRepo := words.NewWordRepository(connectionPool)
	wordSvc := words.NewWordService(wordRepo)
	wordHandler := words.NewHandler(wordSvc)

	userRepo := users.NewUserRepository(connectionPool)
	tokenRepo := auth.NewTokenRepository(connectionPool, []byte(appConfig.JwtSecret))
	authRepo := auth.NewAuthRepository(userRepo, tokenRepo)
	authService := auth.NewAuthService(authRepo, tokenRepo)
	authHandler := auth.NewHandler(authService)

	translationSvc, err := translator.NewTranslationService(ggclient)
	handler := translator.NewHandler(translationSvc)

	var r *gin.Engine = gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     appConfig.AllowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // 12 hours
	}))
	api := r.Group("/api")
	handler.RegisterRoutes(api)
	wordHandler.RegisterRoutes(api)
	authHandler.RegisterRoutes(api)

	r.Run(appConfig.BaseUrl)
}
