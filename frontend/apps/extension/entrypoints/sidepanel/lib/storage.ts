import type { Tokens } from './types';

export async function getTokens(): Promise<Tokens | null> {
  const result = await browser.storage.local.get(['accessToken', 'refreshToken']);
  const { accessToken, refreshToken } = result as Record<string, string | undefined>;
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function saveTokens(tokens: Tokens): Promise<void> {
  await browser.storage.local.set(tokens as unknown as Record<string, unknown>);
}

export async function clearTokens(): Promise<void> {
  await browser.storage.local.remove(['accessToken', 'refreshToken']);
}
