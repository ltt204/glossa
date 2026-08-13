
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

export type BackendWord = {
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

export function normalizeWord(input: BackendWord): Word {
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