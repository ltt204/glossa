package agent

import (
	_ "embed"
	"strings"
)

//go:embed prompt_templates.md
var promptTemplate string

func Init() string {
	if promptTemplate != "" {
		return promptTemplate
	}

	return ""
}

func ConstructTranslationPrompt(
	// targetLang string,
	// sourceLang string,
	// origin string,
	// partOfSpeech []string,
	props TranslateProps,
) string {
	prompt := Init()
	prompt = strings.ReplaceAll(prompt, "$TARGET_LANG", props.TargetLang)
	prompt = strings.ReplaceAll(prompt, "$SOURCE_LANG", props.SourceLang)
	prompt = strings.ReplaceAll(prompt, "$ORIGIN", props.Origin)
	prompt = strings.ReplaceAll(prompt, "$MEANINGS", props.Meanings)

	return prompt
}
