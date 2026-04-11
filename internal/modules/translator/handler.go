package translator

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
)

type TranslationHandler struct {
	translationSvc *TranslationService
}

func NewHandler(svc *TranslationService) *TranslationHandler {
	return &TranslationHandler{translationSvc: svc}
}

func (h *TranslationHandler) handleTranslate(ctx context.Context, text string, target string) (string, error) {
	result, err := h.translationSvc.Translate(ctx, text, target)

	if err != nil {
		return "", fmt.Errorf("Translate Error: %w", err)
	}

	return result, nil
}

func (h *TranslationHandler) RegisterRoute(rg *gin.RouterGroup) {

}
