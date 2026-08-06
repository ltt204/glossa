package middleware

import (
	"glossa/internal/apperror"
	"glossa/internal/responsedto"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(401, responsedto.ErrorResponse(apperror.ErrUnauthorized.WithMessage("Missing or malformed token.")))
			return
		}

		tokenString := strings.TrimPrefix(header, "Bearer ")
		if tokenString == "" {
			c.AbortWithStatusJSON(401, responsedto.ErrorResponse(apperror.ErrUnauthorized.WithMessage("Missing token.")))
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, apperror.ErrUnauthorized.WithMessage("Invalid token")
			}

			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(401, responsedto.ErrorResponse(apperror.ErrUnauthorized.WithMessage("Invalid or expired token.")))
			return
		}

		// Extract user ID from claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(401, responsedto.ErrorResponse(apperror.ErrUnauthorized.WithMessage("Invalid token.")))
			return
		}

		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			c.AbortWithStatusJSON(401, responsedto.ErrorResponse(apperror.ErrUnauthorized.WithMessage("Invalid token subject.")))
			return
		}

		c.Set("user_id", userID)

		c.Next()
	}
}
