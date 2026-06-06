package auth

import (
	"glossa/internal/apperror"
	"glossa/internal/responsedto"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authSvc AuthService
}

func NewHandler(s AuthService) *AuthHandler {
	return &AuthHandler{
		authSvc: s,
	}
}

func (h *AuthHandler) RegisterRoutes(rg *gin.RouterGroup) {
	publicRoutes := rg.Group("/auth")
	publicRoutes.POST("/signup", h.handleSignup)
	publicRoutes.POST("/signin", h.handleSignin)
	publicRoutes.POST("/refresh", h.handleRefreshToken)
}

func (h *AuthHandler) RegisterProtectedRoutes(rg *gin.RouterGroup) {
	protectedRoutes := rg.Group("/auth")
	protectedRoutes.POST("/logout", h.handleLogout)
}

func (h *AuthHandler) handleSignup(ctx *gin.Context) {
	var req SignupRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(apperror.New("BAD_REQUEST", 400, "Invalid request", err)))
		return
	}
	if result, err := h.authSvc.Signup(ctx, req); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(err))
		return
	} else {
		ctx.JSON(200, gin.H{"message": "User created successfully", "user": result})
	}
}

func (h *AuthHandler) handleSignin(ctx *gin.Context) {
	var req SigninRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(apperror.New("BAD_REQUEST", 400, "Invalid request", err)))
		return
	}
	if result, err := h.authSvc.Signin(ctx, req); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(err))
		return
	} else {
		ctx.JSON(200, gin.H{"message": "User signed in successfully", "user": result})
	}
}

func (h *AuthHandler) handleRefreshToken(ctx *gin.Context) {
	var req RefreshTokenRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(apperror.New("BAD_REQUEST", 400, "Invalid request", err)))
		return
	}
	if result, err := h.authSvc.RefreshToken(ctx, req); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(err))
		return
	} else {
		ctx.JSON(200, gin.H{"message": "User signed in successfully", "user": result})
	}
}

func (h *AuthHandler) handleLogout(ctx *gin.Context) {
	if result, err := h.authSvc.Logout(ctx); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(err))
		return
	} else {
		ctx.JSON(200, gin.H{"message": "User signed out successfully", "user": result})
	}
}
