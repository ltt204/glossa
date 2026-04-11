package translator

import (
	"fmt"
	"glossa/backend/modules/translator/dtos"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type TranslationHandler struct {
	translationSvc *TranslationService
}

func NewHandler(svc *TranslationService) *TranslationHandler {
	return &TranslationHandler{translationSvc: svc}
}

func (h *TranslationHandler) handleTranslate(ctx *gin.Context) {
	var req dtos.TranslateRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status_code": "401",
			"error":       fmt.Errorf("Bad body structure"),
			"timestamp":   time.Now(),
		})
	}

	result, err := h.translationSvc.Translate(ctx, req.Text, req.Target)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("Translate Error: %w", err).Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"translation": result,
	})
}

func (h *TranslationHandler) RegisterRoute(rg *gin.RouterGroup) {
	rg.POST("/translate", h.handleTranslate)
}
