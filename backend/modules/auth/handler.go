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

// Signup
// @Summary      Create a new user
// @Description  Create a new user with email and password
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        signupRequest body SignupRequest true "User signup information"
// @Success      200  {object} SignupSuccessWrapper
// @Failure      400  {object} responsedto.ApplicationErrorResponse
// @Failure      500  {object} responsedto.ApplicationErrorResponse
// @Router       /api/auth/signup [post]
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

// Signin
// @Summary      Sign in to an existing account
// @Description  Sign in with email and password
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        signinRequest body SigninRequest true "User signin information"
// @Success      200  {object} SigninSuccessWrapper
// @Failure      400  {object} responsedto.ApplicationErrorResponse
// @Failure      500  {object} responsedto.ApplicationErrorResponse
// @Router       /api/auth/signin [post]
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

// RefreshToken
// @Summary      Refresh access token
// @Description  Refresh access token with refresh token
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        refreshTokenRequest body RefreshTokenRequest true "User refresh token information"
// @Success      200  {object} RefreshTokenSuccessWrapper
// @Failure      400  {object} responsedto.ApplicationErrorResponse
// @Failure      500  {object} responsedto.ApplicationErrorResponse
// @Router       /api/auth/refresh [post]
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

// Logout
// @Summary      Logout from an account
// @Description  Logout from an account
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Success      200  {object} LogoutSuccessWrapper
// @Failure      400  {object} responsedto.ApplicationErrorResponse
// @Failure      500  {object} responsedto.ApplicationErrorResponse
// @Security     BearerAuth
// @Router       /api/auth/logout [post]
func (h *AuthHandler) handleLogout(ctx *gin.Context) {
	if result, err := h.authSvc.Logout(ctx); err != nil {
		ctx.JSON(400, responsedto.ErrorResponse(err))
		return
	} else {
		ctx.JSON(200, gin.H{"message": "User signed out successfully", "user": result})
	}
}
