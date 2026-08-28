package agent

import (
	"os"
	"strings"
)

func Init() string {
	bytes, err := os.ReadFile("/home/ltt204/go-project/glossa/backend/modules/agent/prompt_templates.md")
	if err != nil {
		panic(err)
	}

	return string(bytes)
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
