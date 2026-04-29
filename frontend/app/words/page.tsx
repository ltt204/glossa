"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookMarked, Plus, Trash2, Volume2 } from "lucide-react";
import {
  createWord,
  deleteWord,
  listWords,
  WordsApiError,
  type CreateWordInput,
  type Word,
} from "@/lib/api/words";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
] as const;

const EMPTY_FORM: CreateWordInput = {
  origin: "",
  source: "en",
  translated: "",
  target: "vi",
};

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateWordInput>(EMPTY_FORM);
  const [saving, startSaving] = useTransition();

  // Initial load. AbortController prevents state updates if the component
  // unmounts mid-request (e.g. user navigates away during fetch).
  useEffect(() => {
    const ctrl = new AbortController();
    listWords(ctrl.signal)
      .then((data) => setWords(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof WordsApiError ? err.message : "Failed to load");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const handleCreate = useCallback(() => {
    if (!form.origin.trim() || !form.translated.trim()) return;
    startSaving(async () => {
      try {
        const created = await createWord(form);
        // Optimistic-ish: we trust the server's returned row (has id + createdAt)
        setWords((prev) => [created, ...prev]);
        setForm(EMPTY_FORM);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof WordsApiError ? err.message : "Failed to save");
      }
    });
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    // Optimistic delete: remove from UI immediately, rollback on failure.
    const snapshot = words;
    setWords((prev) => prev.filter((w) => w.id !== id));
    try {
      await deleteWord(id);
    } catch (err: unknown) {
      setWords(snapshot); // rollback
      setError(err instanceof WordsApiError ? err.message : "Failed to delete");
    }
  }, [words]);

  const handleSpeak = (text: string, lang: string) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col flex-1 items-center mesh-bg min-h-screen p-4 sm:p-8">
      <div className="frost-panel w-full max-w-2xl rounded-3xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
              <BookMarked className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold tracking-tight">
                Saved Words
              </h1>
              <p className="text-[11px] text-muted-foreground/70">
                {loading ? "Loading…" : `${words.length} word${words.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
        </header>

        {/* Create form */}
        <section className="px-6 py-5 border-b border-border/40 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={form.origin}
              onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
              placeholder="Original word"
              className="h-10 rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 transition"
            />
            <input
              type="text"
              value={form.translated}
              onChange={(e) => setForm((f) => ({ ...f, translated: e.target.value }))}
              placeholder="Translation"
              className="h-10 rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={form.source}
              onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}
            >
              <SelectTrigger className="flex-1 h-9 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-muted-foreground/50 text-xs">→</span>

            <Select
              value={form.target}
              onValueChange={(v) => setForm((f) => ({ ...f, target: v }))}
            >
              <SelectTrigger className="flex-1 h-9 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleCreate}
              disabled={saving || !form.origin.trim() || !form.translated.trim()}
              size="sm"
              className="rounded-2xl shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {saving ? "Saving…" : "Add"}
            </Button>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* List */}
        <section className="flex-1 px-6 py-4 space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground/60 italic">Loading words…</p>
          ) : words.length === 0 ? (
            <p className="text-sm text-muted-foreground/60 italic">
              No saved words yet. Add one above.
            </p>
          ) : (
            words.map((w) => (
              <article
                key={w.id}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-input/30 hover:bg-input/50 transition-colors px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-[15px] truncate">{w.origin}</span>
                    <span className="text-[10px] uppercase text-muted-foreground/60 tracking-wider">
                      {w.source}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 text-muted-foreground">
                    <span className="text-sm truncate">{w.translated}</span>
                    <span className="text-[10px] uppercase text-muted-foreground/60 tracking-wider">
                      {w.target}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleSpeak(w.origin, w.source)}
                        className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Listen</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(w.id)}
                        className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
