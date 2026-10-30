// A small fetch wrapper for the PENTANA `/api/v1` JSON API (Laravel + Sanctum bearer tokens).

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiClientOptions = {
  baseUrl: string;
  getToken: () => string | null;
  /** Called on any 401 from an authenticated request, so the app can sign out. */
  onUnauthorized?: () => void;
  fetchImpl?: typeof fetch;
};

export type ApiClient = {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
};

export function createApiClient({ baseUrl, getToken, onUnauthorized, fetchImpl = fetch }: ApiClientOptions): ApiClient {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = getToken();
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && token) onUnauthorized?.();
      const message = typeof payload?.message === 'string' ? payload.message : `Request failed (${response.status})`;
      throw new ApiError(response.status, message);
    }
    return payload as T;
  }

  return {
    get: path => request('GET', path),
    post: (path, body) => request('POST', path, body),
  };
}
