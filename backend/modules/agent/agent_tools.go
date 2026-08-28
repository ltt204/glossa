package agent

// import (
// 	"context"
// 	"fmt"
// 	"io"
// 	"log"
// 	"net/http"

// 	"charm.land/fantasy"
// )

// var (
// 	DictionaryAgentTool = fantasy.NewAgentTool(
// 		"dictionary_tool",
// 		`
// 		Look up a word in the dictionary. Returns the definition of the word.
// 		Format:
// 		[
// 		{
// 			"word": string,
// 			"phonetics":
// 			[
// 				{
// 				"text": string,
// 				"audio": string,
// 				"sourceUrl": string,
// 				"license":
// 					{
// 					"name": string,
// 					"url": string
// 					}
// 				"sourceUrl": string
// 				}
// 			],
// 			"meanings":
// 			[
// 				{
// 				"partOfSpeech":string,
// 				"definitions":
// 					[
// 					{
// 						"definition":string,
// 						"synonyms":[]string,
// 						"antonyms":[]string
// 					}
// 					],
// 				"synonyms":[]string,
// 				"antonyms":[]string
// 				}
// 			],
// 			"license":
// 			{
// 				"name":string,
// 				"url":string
// 			},
// 			"sourceUrls": []string
// 		}
// 		]

// 		Json Response Example:
// 		[
// 		{
// 			"word": "hello",
// 			"phonetic": "həˈləʊ",
// 			"phonetics": [
// 			{
// 				"text": "həˈləʊ",
// 				"audio": "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3"
// 			},
// 			{
// 				"text": "hɛˈləʊ"
// 			}
// 			],
// 			"origin": "early 19th century: variant of earlier hollo ; related to holla.",
// 			"meanings": [
// 			{
// 				"partOfSpeech": "exclamation",
// 				"definitions": [
// 				{
// 					"definition": "used as a greeting or to begin a phone conversation.",
// 					"example": "hello there, Katie!",
// 					"synonyms": [],
// 					"antonyms": []
// 				}
// 				]
// 			},
// 			{
// 				"partOfSpeech": "noun",
// 				"definitions": [
// 				{
// 					"definition": "an utterance of ‘hello’; a greeting.",
// 					"example": "she was getting polite nods and hellos from people",
// 					"synonyms": [],
// 					"antonyms": []
// 				}
// 				]
// 			},
// 			{
// 				"partOfSpeech": "verb",
// 				"definitions": [
// 				{
// 					"definition": "say or shout ‘hello’.",
// 					"example": "I pressed the phone button and helloed",
// 					"synonyms": [],
// 					"antonyms": []
// 				}
// 				]
// 			}
// 			]
// 		}
// 		]
// 		`,
// 		func(ctx context.Context, input any, call fantasy.ToolCall) (fantasy.ToolResponse, error) {
// 			result := fantasy.ToolResponse{
// 				IsError: true,
// 			}

// 			dictUrl := "https://api.dictionaryapi.dev/api/v2/entries/en/" + input.(string)
// 			response, err := http.Get(dictUrl)
// 			if err != nil {
// 				return result, err
// 			}
// 			defer response.Body.Close()

// 			if response.StatusCode == http.StatusNotFound {
// 				return result, nil
// 			}

// 			if response.StatusCode != http.StatusOK {
// 				return result, fmt.Errorf("dictionary api error: %s", response.Status)
// 			}

// 			body, err := io.ReadAll(response.Body)
// 			if err != nil {
// 				log.Fatalf("Failed to read body: %v", err)
// 			}ư

// 			result.Type = "dictionary"
// 			result.Content = string(body)
// 			result.IsError = false

// 			return result, nil
// 		},
// 	)
// )
