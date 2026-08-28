package main

import (
	"context"
	"glossa/internal/config"
	"glossa/internal/db"
	"glossa/internal/middleware"
	"glossa/modules/agent"
	"glossa/modules/auth"
	"glossa/modules/definition"
	"glossa/modules/translator"
	"glossa/modules/users"
	"glossa/modules/words"
	"log"
	"os"
	"os/signal"
	"syscall"

	_ "glossa/cmd/api/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Glossa API
// @version 1.0
// @description This is a sample server for Glossa.
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email [EMAIL_ADDRESS]
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8000
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer <your_token>" to authenticate.
func main() {
	ctx := context.Background()
	translationClient, err := translator.NewGoogleClient(ctx)
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

	wordHandler := words.Init(connectionPool)

	userRepo := users.NewUserRepository(connectionPool)
	tokenRepo := auth.NewTokenRepository(connectionPool, []byte(appConfig.JwtSecret))
	authRepo := auth.NewAuthRepository(userRepo, tokenRepo)
	uConverter := users.UserConverterImpl{}
	authService := auth.NewAuthService(authRepo, tokenRepo, &uConverter)
	authHandler := auth.NewHandler(*authService)

	agentConfig, err := agent.Load()
	if err != nil {
		log.Fatal("Failed to load agent config: ", err)
	}
	definitionService := definition.NewWordDefinitionService(appConfig.DictApi)
	agentService := agent.NewAgentService(definitionService, agentConfig)
	translationSvc, err := translator.NewTranslationService(translationClient, appConfig.DictApi, appConfig.ProjectID, definitionService, agentService)
	translateHandler := translator.NewHandler(translationSvc)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     appConfig.AllowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // 12 hours
	}))

	routes := router.Group("/api")
	{
		authHandler.RegisterRoutes(routes)
	}

	protectedRoutes := routes.Group("/")
	protectedRoutes.Use(middleware.AuthMiddleware([]byte(appConfig.JwtSecret)), middleware.Logger())
	{
		authHandler.RegisterProtectedRoutes(protectedRoutes)
		wordHandler.RegisterRoutes(protectedRoutes)
		translateHandler.RegisterRoutes(protectedRoutes)
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Run(appConfig.BaseUrl)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit

	if err := translationClient.Close(); err != nil {
		log.Fatal("Failed to close translation client: ", err)
	}

	log.Println("Server stopped properly")
}
