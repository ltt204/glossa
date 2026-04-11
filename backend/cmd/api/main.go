package main

import (
	"context"
	"glossa/internal/config"
	"glossa/modules/translator"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	ctx := context.Background()
	ggclient, err := translator.NewGoogleClient(ctx)
	if err != nil {

	}

	appConfig, err := config.Load()

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

	handler.RegisterRoute(api)

	r.Run(appConfig.BaseUrl)
}
