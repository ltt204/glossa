import { useEffect, useState } from 'react';
import { setOnUnauthorized } from './lib/api';
import { getTokens } from './lib/storage';
import LoginView from './views/login-view';
import TranslatorView from './views/TranslatorView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    getTokens().then((tokens) => setIsAuthenticated(!!tokens));
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => setIsAuthenticated(false));
  }, []);

  // Listen for text selections sent by the content script
  useEffect(() => {
    const handler = (msg: { type: string; text: string }) => {
      if (msg.type === 'SELECTION') {
        window.__glossaSelection = msg.text;
      }
    };
    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 text-sm">
        Loading…
      </div>
    );
  }

  return isAuthenticated ? (
    <TranslatorView onLogout={() => setIsAuthenticated(false)} />
  ) : (
    <LoginView onLogin={() => setIsAuthenticated(true)} />
  );
}

// Extend window to carry selected text across renders without prop drilling
declare global {
  interface Window {
    __glossaSelection?: string;
  }
}
