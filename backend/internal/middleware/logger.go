package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Pre-handler phase
		c.Next()

		// Post-handler phase
		latency := time.Since(start)
		log.Printf("Request took %v", latency)
	}
}
