import { useEffect, useState } from 'react';
import { deleteWord, getWords } from '../lib/api';
import type { Word } from '../lib/types';

export default function SavedWordsView() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getWords()
      .then(setWords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteWord(id);
      setWords((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-400 text-center mt-8">Loading…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500 text-center mt-8">{error}</p>;
  }

  if (words.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center mt-8">
        No saved words yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {words.map((word) => (
        <li
          key={word.id}
          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
        >
          <span className="text-sm text-gray-800">
            <span className="font-medium">{word.origin}</span>
            <span className="text-gray-400 mx-1">→</span>
            {word.translated}
          </span>
          <button
            onClick={() => handleDelete(word.id)}
            className="text-gray-400 hover:text-red-500 transition-colors text-xs ml-2"
            aria-label="Delete"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
