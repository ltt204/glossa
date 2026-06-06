package words

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type WordsHandler struct {
	wordSvc *WordService
}

func NewHandler(svc *WordService) *WordsHandler {
	return &WordsHandler{wordSvc: svc}
}

func (h *WordsHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/words", h.handleSaveWord)
	rg.GET("/words", h.handleGetWords)
	rg.DELETE("/words/:id", h.handleDeleteWord)
}

func (h *WordsHandler) handleSaveWord(ctx *gin.Context) {
	var req WordSavingRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status_code": "401",
			"error":       fmt.Errorf("Bad body structure"),
			"timestamp":   time.Now(),
		})
	}

	result, err := h.wordSvc.Save(ctx, req.ToWord())

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("Save Word Error: %w", err).Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"content": result,
	})
}

func (h *WordsHandler) handleGetWords(ctx *gin.Context) {
	result, err := h.wordSvc.GetAll(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("Get Words Error: %w", err).Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"content": result,
	})
}

func (h *WordsHandler) handleDeleteWord(ctx *gin.Context) {
	wordId, ok := ctx.Params.Get("id")
	if !ok {

	}
	err := h.wordSvc.Delete(ctx, wordId)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("Get Words Error: %w", err).Error(),
		})
		return
	}

	ctx.JSON(http.StatusNoContent, nil)
}

func (h *WordsHandler) handleGetWordsByUserId(ctx *gin.Context) {

}
