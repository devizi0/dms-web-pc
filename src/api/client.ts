export const BASE_URL = 'https://dms-gw.donghyun-mint.workers.dev';

export function getBaseUrl(): string {
  return BASE_URL;
}

export function setBaseUrl(_url: string): void {
  localStorage.removeItem('dms_base_url');
}

const ACCESS_TOKEN_KEY  = 'dms_access_token';
const REFRESH_TOKEN_KEY = 'dms_refresh_token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'dms_access_token_expires_at';
const REFRESH_TOKEN_EXPIRES_AT_KEY = 'dms_refresh_token_expires_at';

export function getToken():         string | null { return localStorage.getItem(ACCESS_TOKEN_KEY); }
export function getRefreshToken():  string | null { return localStorage.getItem(REFRESH_TOKEN_KEY); }
export function getAccessTokenExpiresAt(): string | null { return localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY); }
export function getRefreshTokenExpiresAt(): string | null { return localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY); }
export function setToken(t: string)               { localStorage.setItem(ACCESS_TOKEN_KEY, t); }
export function setRefreshToken(t: string)        { localStorage.setItem(REFRESH_TOKEN_KEY, t); }
export function setAccessTokenExpiresAt(t: string) { localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, t); }
export function setRefreshTokenExpiresAt(t: string) { localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, t); }
export function clearAccessTokenExpiresAt() { localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY); }
export function clearRefreshTokenExpiresAt() { localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY); }
export function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
}

function isExpired(expiresAt: string | null, bufferMs = 0): boolean {
  if (!expiresAt) return false;

  const expiresAtTime = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtTime)) return false;

  return Date.now() + bufferMs >= expiresAtTime;
}

function applyTokenResponse(data: Record<string, unknown>): string {
  const accessToken = data.access_token;
  if (typeof accessToken !== 'string' || !accessToken) {
    throw new ApiError(500, '인증 응답이 올바르지 않습니다.');
  }

  setToken(accessToken);
  clearAccessTokenExpiresAt();
  clearRefreshTokenExpiresAt();

  const refreshToken = data.refresh_token;
  const accessTokenExpiredAt = data.access_token_expired_at;
  const refreshTokenExpiredAt = data.refresh_token_expired_at;

  if (typeof refreshToken === 'string' && refreshToken) {
    setRefreshToken(refreshToken);
  }
  if (typeof accessTokenExpiredAt === 'string' && accessTokenExpiredAt) {
    setAccessTokenExpiresAt(accessTokenExpiredAt);
  }
  if (typeof refreshTokenExpiredAt === 'string' && refreshTokenExpiredAt) {
    setRefreshTokenExpiresAt(refreshTokenExpiredAt);
  }

  return accessToken;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ── Token refresh ────────────────────────────────────────────────────────────
let refreshing: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const rt = getRefreshToken();
  if (!rt) throw new ApiError(401, '로그인이 필요합니다.');
  if (isExpired(getRefreshTokenExpiresAt(), 5_000)) {
    clearToken();
    throw new ApiError(401, '세션이 만료되었습니다. 다시 로그인하세요.');
  }

  let res: Response;
  try {
    res = await fetch(`${getBaseUrl()}/auth/reissue`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'refresh-token': rt,
      },
      body: JSON.stringify({}),
    });
  } catch {
    throw new ApiError(0, '네트워크 오류로 세션을 갱신하지 못했습니다.');
  }

  if (res.status === 401 || res.status === 403 || res.status === 404) {
    clearToken();
    throw new ApiError(401, '세션이 만료되었습니다. 다시 로그인하세요.');
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json() as Record<string, unknown>;
  } catch {
    throw new ApiError(res.status, `HTTP ${res.status}`);
  }

  if (!res.ok) {
    const msg = typeof data.message === 'string' ? data.message : `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  return applyTokenResponse(data);
}

function refreshOnce(): Promise<string> {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => { refreshing = null; });
  }
  return refreshing;
}

export async function recoverSession(): Promise<boolean> {
  const accessToken = getToken();
  if (accessToken && !isExpired(getAccessTokenExpiresAt(), 5_000)) {
    return true;
  }
  if (!getRefreshToken()) return false;
  await refreshOnce();
  return true;
}

async function getAuthorizationToken(): Promise<string | null> {
  const accessToken = getToken();
  const refreshToken = getRefreshToken();

  if (accessToken && !isExpired(getAccessTokenExpiresAt(), 5_000)) {
    return accessToken;
  }

  if (!refreshToken) {
    return accessToken;
  }

  return refreshOnce();
}

// ── Request ──────────────────────────────────────────────────────────────────
interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  noAuth?: boolean;
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}, retry = true): Promise<T> {
  let url = getBaseUrl() + path;
  if (opts.query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    }
    const qs = params.toString();
    if (qs) url += '?' + qs;
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = opts.noAuth ? null : await getAuthorizationToken();
  if (!opts.noAuth && token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError(0, '네트워크 요청에 실패했습니다.');
  }

  // 401 → refresh & retry once
  if (res.status === 401 && !opts.noAuth && retry) {
    try {
      await refreshOnce();
      return request<T>(method, path, opts, false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new ApiError(401, '세션이 만료되었습니다. 다시 로그인하세요.');
      }
      throw error;
    }
  }

  if (res.status === 204) return null as T;

  let data: unknown;
  try { data = await res.json(); } catch { data = null; }

  if (!res.ok) {
    const msg = (data as Record<string, string>)?.message || `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  return data as T;
}

export const client = {
  get:    <T>(path: string, opts?: RequestOptions) => request<T>('GET',    path, opts),
  post:   <T>(path: string, opts?: RequestOptions) => request<T>('POST',   path, opts),
  put:    <T>(path: string, opts?: RequestOptions) => request<T>('PUT',    path, opts),
  patch:  <T>(path: string, opts?: RequestOptions) => request<T>('PATCH',  path, opts),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
};
