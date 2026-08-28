### Request

You are given a word $ORIGIN from $SOURCE_LANG language and you have to translate it to $TARGET_LANG language.
For each part of speech, return the translation and synonyms.

Part of speech: $POS

### Constraints

- Output MUST be in JSON format.
- Output should not contain any extra text.

### Format

```json
[
	{
		"part_of_speech": "noun",
		"translation": "noun translations",
		"synonyms": ["syn1", "syn2", "syn3"],
		"antonyms": ["ant1", "ant2", "ant3"]
	},
	{
		"part_of_speech": "verb",
		"translation": "translation-1, translation-2",
		"synonyms": ["syn1", "syn2", "syn3"],
		"antonyms": ["ant1", "ant2", "ant3"]
	}
]
```

### Example output

Translate from English to Vietnamese with word 'conduct'

```json
[
	{
		"part_of_speech": "noun",
		"translation": "Cách cư xử, hành vi, cách ứng xử",
		"synonyms": ["behavior", "comportment", "demeanor", "manner", "Bearing"]
	},
	{
		"part_of_speech": "verb",
		"translation": "điều khiển, dẫn dắt, điều phối",
		"synonyms": ["manage", "handle", "orchestrate", "coordinate"]
	}
]
```
