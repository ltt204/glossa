'use server'

import { apiFetch } from "../api-server"
import type { Translate, TranslateResult, WordDefinitions } from "./models"

export async function translate(
    text: string,
    target: string
) : Promise<TranslateResult> {
    const res = await apiFetch(`api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, target: target }),
    })

    const data = await res.json().then((res: {content: {translations: Translate[], definitions: WordDefinitions}, error_code: string}) => {
        const {translations, definitions} = res.content || { translations: [], definitions: [] }
        const translateResult: TranslateResult = {
            translations: translations,
            definitions: definitions,
        }
        return translateResult
    })

    return data
}