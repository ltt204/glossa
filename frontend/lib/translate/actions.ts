'use server'

import { apiFetch } from "../api-server"
import type { TranslateResult } from "./models"

export async function translate(
    text: string,
    target: string
) : Promise<TranslateResult> {
    const res = await apiFetch<TranslateResult>(`api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, target: target }),
    })

    if (res.status !== 200 || !res.content) {
        throw Error(res.message)   
    }

    return res.content
}