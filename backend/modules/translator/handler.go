package translator

import (
	"context"
	"glossa/internal/apperror"
	"glossa/internal/responsedto"
	"glossa/modules/definition"
	"glossa/modules/translator/dtos"
	"log"
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

// Translate
// @Summary      Translate text
// @Description  Translate text to a target language using Google Cloud Translation API
// @Tags         Translator
// @Accept       json
// @Produce      json
// @Param        translateRequest body dtos.TranslateRequest true "Translation request body"
// @Success      200  {object} responsedto.ApplicationResponse{content=dtos.Translation} "Translate success"
// @Failure      400  {object} responsedto.ApplicationErrorResponse "Invalid JSON structure"
// @Failure      500  {object} responsedto.ApplicationErrorResponse "Failed to translate word"
// @Security     BearerAuth
// @Router       /api/translate [post]
func (h *TranslationHandler) handleTranslate(ctx *gin.Context) {
	reqCtx, cancel := context.WithTimeout(ctx.Request.Context(), 5*time.Second)
	defer cancel()

	select {
	case <-reqCtx.Done():
		appErr := apperror.TimeoutError.WithMessage("Request timed out.")
		ctx.JSON(appErr.Status, appErr.ToGinMap())
		return
	default:
		var req dtos.TranslateRequest
		if err := ctx.ShouldBindJSON(&req); err != nil {
			appErr := apperror.ErrBadJsonStructure.WithErr(err)
			ctx.JSON(appErr.Status, appErr.ToGinMap())
			return
		}

		result, err := h.translationSvc.Translate(reqCtx, req.Text, req.Target)
		if err != nil {
			appErr := apperror.FailedTranslateWord.WithErr(err)
			appRes := responsedto.ErrorResponse(appErr)
			ctx.JSON(appErr.Status, appRes)
			return
		}

		appRes := responsedto.SuccessResponse("Translate success", result)
		ctx.JSON(http.StatusOK, appRes)
	}
}

func (h *TranslationHandler) handleTranslateMock(ctx *gin.Context) {
	select {
	case <-ctx.Request.Context().Done():
		log.Println("Canceled handleTranslateMock")
		return
	case <-time.After(2 * time.Second):

		appRes := responsedto.SuccessResponse("Translate success", dtos.WordResult{
			Translations: []dtos.Translation{
				{
					TranslatedText:       "Mock Translation Response",
					DetectedLanguageCode: "en",
				},
			},
			Definitions: []definition.WordDefinitions{
				{
					Word: "Mock Definition",
					Phonetics: []definition.Phonetic{
						{
							Text: "/mock/phonetic/",
						},
					},
					Meanings: []definition.Meaning{
						{
							PartOfSpeech: "mock_verb",
							Definitions: []definition.Definition{
								{
									Definition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
									Example:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
									Synonyms:   []string{"Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"},
								},
							},
						},
						{
							PartOfSpeech: "mock_noun",
							Definitions: []definition.Definition{
								{
									Definition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
									Example:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
									Synonyms:   []string{"Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"},
								},
							},
						},
						{
							PartOfSpeech: "mock_adjective",
							Definitions: []definition.Definition{
								{
									Definition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
									Example:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
									Synonyms:   []string{"Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"},
								},
							},
						},
					},
				},
			},
		})

		ctx.JSON(http.StatusOK, appRes)
	}
}

func (h *TranslationHandler) handleTranslateWithAgent(ctx *gin.Context) {
	reqCtx, cancel := context.WithTimeout(ctx.Request.Context(), 20*time.Second)
	defer cancel()

	select {
	case <-reqCtx.Done():
		appErr := apperror.TimeoutError.WithMessage("Request timed out.")
		ctx.JSON(appErr.Status, appErr.ToGinMap())
		return
	default:
		var req dtos.TranslateRequest
		if err := ctx.ShouldBindJSON(&req); err != nil {
			appErr := apperror.ErrBadJsonStructure.WithErr(err)
			ctx.JSON(appErr.Status, appErr.ToGinMap())
			return
		}

		result, err := h.translationSvc.TranslateWithAgent(reqCtx, req.Text, req.Target)
		if err != nil {
			log.Println("Error translating word: ", err)
			appErr := apperror.FailedTranslateWord.WithErr(err)
			appRes := responsedto.ErrorResponse(appErr)
			ctx.JSON(appErr.Status, appRes)
			return
		}

		appRes := responsedto.SuccessResponse("Translate success", result)
		ctx.JSON(http.StatusOK, appRes)
	}
}

func (h *TranslationHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/translate", h.handleTranslateWithAgent)
}
