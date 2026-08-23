export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
}

// Wraps all successful responses from the backend: { success, message, content }
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  content: T;
}

export interface SigninResponseData {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Word {
  id: string;
  user_id: string;
  origin: string;
  source_lang: string;
  translated: string;
  target_lang: string;
  is_saved: boolean;
}
