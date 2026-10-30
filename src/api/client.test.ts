import { ApiError, createApiClient } from './client';

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

describe('createApiClient', () => {
  it('sends the bearer token and returns the parsed body', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(200, { data: [] }));
    const api = createApiClient({ baseUrl: 'https://x.test/api/v1/', getToken: () => 'abc', fetchImpl });

    await expect(api.get('/bills')).resolves.toEqual({ data: [] });

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://x.test/api/v1/bills');
    expect(init.headers.Authorization).toBe('Bearer abc');
  });

  it('throws an ApiError with the server message', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(401, { message: 'The provided credentials are incorrect.' }));
    const api = createApiClient({ baseUrl: 'https://x.test', getToken: () => null, fetchImpl });

    const error = (await api.post('/login', { email: 'a@b.c' }).catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
    expect(error.message).toBe('The provided credentials are incorrect.');
  });

  it('signs out on a 401 only when a token was sent', async () => {
    const onUnauthorized = jest.fn();
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(401, {}));

    const signedOut = createApiClient({ baseUrl: 'https://x.test', getToken: () => null, onUnauthorized, fetchImpl });
    await signedOut.post('/login').catch(() => undefined);
    expect(onUnauthorized).not.toHaveBeenCalled();

    const signedIn = createApiClient({ baseUrl: 'https://x.test', getToken: () => 'expired', onUnauthorized, fetchImpl });
    await signedIn.get('/bills').catch(() => undefined);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
