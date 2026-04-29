// Thin typed client around the Glossa words API.
// The Go backend owns the source of truth; this file is just HTTP plumbing.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Word = {
  id: string;
  origin: string;
  source: string;
  translated: string;
  target: string;
  createdAt: string; // ISO string from Go's time.Time JSON encoding
};

export type CreateWordInput = {
  origin: string;
  source: string;
  translated: string;
  target: string;
};

type BackendWord = {
  id?: string;
  origin?: string;
  source?: string;
  translated?: string;
  target?: string;
  createdAt?: string;
  Id?: string;
  Origin?: string;
  SourceLang?: string;
  Translated?: string;
  TargetLang?: string;
};

function normalizeWord(input: BackendWord): Word {
  return {
    id: input.id ?? input.Id ?? "",
    origin: input.origin ?? input.Origin ?? "",
    source: input.source ?? input.SourceLang ?? "",
    translated: input.translated ?? input.Translated ?? "",
    target: input.target ?? input.TargetLang ?? "",
    createdAt: input.createdAt ?? "",
  };
}

// Central error so callers can distinguish network/HTTP failures from app bugs.
export class WordsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "WordsApiError";
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new WordsApiError(
      body?.error || `Request failed: ${res.status}`,
      res.status
    );
  }
  // DELETE returns no body
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function listWords(signal?: AbortSignal): Promise<Word[]> {
  const res = await fetch(`${API_URL}/api/words`, { signal });
  const data = await handle<{ content?: BackendWord[] } | BackendWord[] | null>(res);
  const rows = Array.isArray(data) ? data : data?.content;
  if (!Array.isArray(rows)) return [];
  return rows.map(normalizeWord);
}

export async function createWord(input: CreateWordInput): Promise<Word> {
  const res = await fetch(`${API_URL}/api/words`, {
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
  const res = await fetch(`${API_URL}/api/words/${id}`, {
    method: "DELETE",
  });
  return handle<void>(res);
}
