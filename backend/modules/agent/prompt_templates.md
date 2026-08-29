### Request

You are given a word $ORIGIN from $SOURCE_LANG language and you have to translate it to $TARGET_LANG language.
For each definition of the word within a part of speech, you will need to filling the empty string to complete the meaning of the word.

Meaning Input: $MEANINGS

### Constraints

- Output MUST be in JSON format.
- Output should not contain any extra text.
- The translated word must be easy to understand and suitable for the target language.
- The translated word should be as natural as possible and should not sound like a direct translation.
- The definitions, synonyms, antonyms must be filled in $SOURCE_LANG language

### Format

[
{
"partOfSpeech": "noun",
"translated": "noun translations",
"definitions": [
{
"definition": "noun-definition-1",
"synonyms": ["syn1", "syn2", "syn3"],
"antonyms": ["ant1", "ant2", "ant3"]
},
{
"definition": "noun-definition-2",
"synonyms": ["syn1", "syn2", "syn3"],
"antonyms": ["ant1", "ant2", "ant3"]
}
]
},
{
"partOfSpeech": "verb",
"translated": "translation-1, translation-2",
"definitions": [
{
"definition": "verb-definition-1",
"synonyms": ["syn1", "syn2", "syn3"],
"antonyms": ["ant1", "ant2", "ant3"]
},
{
"definition": "verb-definition-2",
"synonyms": ["syn1", "syn2", "syn3"],
"antonyms": ["ant1", "ant2", "ant3"]
}
]
}
]

### Example

#### Meanings Input

{
"meanings": [
{
"partOfSpeech": "noun",
"translated": "",
"definitions": [
{
"definition": "The act or method of controlling or directing",
"synonyms": [],
"antonyms": []
},
{
"definition": "Convoy; escort; person who accompanies another",
"synonyms": [],
"antonyms": []
},
{
"definition": "Something which carries or conveys anything; a channel; an instrument.",
"synonyms": [],
"antonyms": []
}
]
},
{
"partOfSpeech": "verb",
"translated": "",
"definitions": [
{
"definition": "To lead, or guide; to escort.",
"synonyms": [],
"antonyms": []
},
{
"definition": "To lead; to direct; to be in charge of (people or tasks)",
"synonyms": [],
"antonyms": [],
"example": "The commander conducted thousands of troops."
}
]
}
]
}

#### Expected output

{
"meanings": [
{
"partOfSpeech": "noun",
"translated": "cách cư xử, hành vi, cách ứng xử",
"definitions": [
{
"definition": "The act or method of controlling or directing",
"synonyms": [
"behavior",
"comportment",
"demeanor",
"manner",
"bearing"
],
"antonyms": ["misbehavior", "misconduct", "impropriety"]
},
{
"definition": "Convoy; escort; person who accompanies another",
"synonyms": ["convoy", "escort", "guard", "protection", "escortee"],
"antonyms": ["attacker", "enemy", "opponent"]
}
]
},
{
"partOfSpeech": "verb",
"translated": "điều khiển, dẫn dắt, điều phối",
"definitions": [
{
"definition": "To lead, or guide; to escort.",
"synonyms": ["lead", "guide", "escort", "accompany", "usher"],
"antonyms": ["hinder", "impede", "obstruct", "delay", "stop"]
},
{
"definition": "To lead; to direct; to be in charge of (people or tasks)",
"synonyms": [
"lead",
"guide",
"manage",
"direct",
"orchestrate",
"coordinate"
],
"antonyms": ["follow", "obey", "submit", "yield"]
}
]
}
]
}
