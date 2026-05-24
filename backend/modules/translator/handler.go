package translator

import (
	"glossa/internal/apperror"
	"glossa/internal/responsedto"
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

func (h *TranslationHandler) RegisterRoute(rg *gin.RouterGroup) {
	rg.POST("/translate", h.handleTranslate)
}
