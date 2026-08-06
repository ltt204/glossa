import { clearTokens, getTokens, saveTokens } from './storage';
import type { ApiResponse, SigninResponseData, Tokens, Word } from './types';

const BASE_URL = 'http://localhost:8000/api';

// Called when refresh fails — App.tsx sets this to trigger the login screen
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

async function request<T>(
  path: string,
  options: RequestInit,
  retry = true,
): Promise<T> {
  const tokens = await getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options, false);
    await clearTokens();
    onUnauthorized?.();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function tryRefresh(): Promise<boolean> {
  const tokens = await getTokens();
  if (!tokens?.refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokens.refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    await saveTokens({ ...tokens, accessToken: data.user.access_token });
    return true;
  } catch {
    return false;
  }
}

// Auth
export async function signin(email: string, password: string): Promise<Tokens> {
  const data = await request<{ message: string; user: SigninResponseData }>(
    '/auth/signin',
    { method: 'POST', body: JSON.stringify({ email, password }) },
  );
  return {
    accessToken: data.user.access_token,
    refreshToken: data.user.refresh_token,
  };
}

export async function logout(): Promise<void> {
  await request('/auth/logout', { method: 'POST' });
}

// Translate
export async function translate(text: string): Promise<string> {
  const data = await request<ApiResponse<string>>(
    '/translate',
    { method: 'POST', body: JSON.stringify({ text, target: 'vi' }) },
  );
  return data.content;
}

// Words
export async function saveWord(origin: string, translated: string): Promise<Word> {
  const data = await request<{ content: Word }>(
    '/words',
    {
      method: 'POST',
      body: JSON.stringify({ Origin: origin, Source: 'en', Translated: translated, Target: 'vi' }),
    },
  );
  return data.content;
}

export async function getWords(): Promise<Word[]> {
  const data = await request<{ content: Word[] }>('/words', { method: 'GET' });
  return data.content ?? [];
}

export async function deleteWord(id: string): Promise<void> {
  await request(`/words/${id}`, { method: 'DELETE' });
}
