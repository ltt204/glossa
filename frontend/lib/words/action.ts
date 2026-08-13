'use server'
import { apiFetch } from "../api-server";
import { WordsApiError, normalizeWord, Word, BackendWord, CreateWordInput } from "./models";
import { refreshAccessToken } from "../auth/action";

async function handle<T>(res: any): Promise<T> {
  if (!res.ok) throw new WordsApiError("Invalid response payload", res.status);
  
  const data = await res.json().then((res: any) => res as ServerResponse<T>).catch(() => null)
  return data as T;
}

export async function getWords(): Promise<Word[]> {
  const res = await apiFetch("api/words", {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  console.log(res)
  const data = await handle<{ content?: BackendWord[] } | BackendWord[] | null>(res);
  const rows = Array.isArray(data) ? data : data?.content;
  if (!Array.isArray(rows)) return [];
  return rows.map(normalizeWord);
}

export async function createWord(input: CreateWordInput): Promise<Word> {
  const res = await apiFetch(`/api/words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await handle<{ content?: BackendWord } | BackendWord>(res);
  const row = "content" in data ? data.content : data;
  if (!row) throw new WordsApiError("Invalid response payload", res.status);
  return normalizeWord(row);
}

export async function deleteWord(id: string): Promise<void> {
  const res = await apiFetch(`/api/words/${id}`, {
    method: "DELETE",
  });
  return handle<void>(res);
}
