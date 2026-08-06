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

// SaveWord
// @Summary      Save a translated word
// @Description  Save a word translation to the user's dictionary
// @Tags         Words
// @Accept       json
// @Produce      json
// @Param        wordRequest body WordSavingRequest true "Word saving request body"
// @Success      200  {object} WordSaveSuccessWrapper
// @Failure      400  {object} map[string]interface{} "Bad request structure"
// @Failure      500  {object} map[string]interface{} "Internal server error"
// @Security     BearerAuth
// @Router       /api/words [post]
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

// GetWords
// @Summary      Get all saved words
// @Description  Retrieve all word translations saved by the user
// @Tags         Words
// @Accept       json
// @Produce      json
// @Success      200  {object} WordListSuccessWrapper
// @Failure      500  {object} map[string]interface{} "Internal server error"
// @Security     BearerAuth
// @Router       /api/words [get]
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

// DeleteWord
// @Summary      Delete a saved word
// @Description  Delete a saved word translation from the user's dictionary by ID
// @Tags         Words
// @Accept       json
// @Produce      json
// @Param        id   path     string  true  "Word ID to delete"
// @Success      204  "No Content"
// @Failure      500  {object} map[string]interface{} "Internal server error"
// @Security     BearerAuth
// @Router       /api/words/{id} [delete]
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
