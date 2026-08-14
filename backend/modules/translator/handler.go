package translator

import (
	"glossa/internal/apperror"
	"glossa/internal/responsedto"
	"glossa/modules/definition"
	"glossa/modules/translator/dtos"
	"net/http"

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
	var req dtos.TranslateRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		appErr := apperror.ErrBadJsonStructure.WithErr(err)
		ctx.JSON(appErr.Status, appErr.ToGinMap())
		return
	}

	result, err := h.translationSvc.Translate(ctx, req.Text, req.Target)
	if err != nil {
		appErr := apperror.FailedTranslateWord.WithErr(err)
		appRes := responsedto.ErrorResponse(appErr)
		ctx.JSON(appErr.Status, appRes)
		return
	}

	appRes := responsedto.SuccessResponse("Translate success", result)

	ctx.JSON(http.StatusOK, appRes)
}

func (h *TranslationHandler) handleTranslateMock(ctx *gin.Context) {
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
						PartOfSpeech: "mock",
						Definitions: []definition.Definition{
							{
								Definition: "Mock definition",
								Example:    "Mock example",
								Synonyms:   []string{"mock", "synonym"},
							},
						},
					},
					{
						PartOfSpeech: "mock",
						Definitions: []definition.Definition{
							{
								Definition: "Mock definition",
								Example:    "Mock example",
								Synonyms:   []string{"mock", "synonym"},
							},
						},
					},
					{
						PartOfSpeech: "mock",
						Definitions: []definition.Definition{
							{
								Definition: "Mock definition",
								Example:    "Mock example",
								Synonyms:   []string{"mock", "synonym"},
							},
						},
					},
				},
			},
		},
	})

	ctx.JSON(http.StatusOK, appRes)
}

func (h *TranslationHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/translate", h.handleTranslate)
}
