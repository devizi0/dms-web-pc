export const BASE_URL = 'https://dms-gw.donghyun-mint.workers.dev';

const BASE_URL_KEY = 'dms_base_url';

export function getBaseUrl(): string {
  const storedBaseUrl = localStorage.getItem(BASE_URL_KEY)?.trim();
  return storedBaseUrl || BASE_URL;
}

export function setBaseUrl(url: string): void {
  const normalizedUrl = url.trim();

  if (!normalizedUrl || normalizedUrl === BASE_URL) {
    localStorage.removeItem(BASE_URL_KEY);
    return;
  }

  localStorage.setItem(BASE_URL_KEY, normalizedUrl);
}

const ACCESS_TOKEN_KEY  = 'dms_access_token';
const REFRESH_TOKEN_KEY = 'dms_refresh_token';

export function getToken():         string | null { return localStorage.getItem(ACCESS_TOKEN_KEY); }
export function getRefreshToken():  string | null { return localStorage.getItem(REFRESH_TOKEN_KEY); }
export function setToken(t: string)               { localStorage.setItem(ACCESS_TOKEN_KEY, t); }
export function setRefreshToken(t: string)        { localStorage.setItem(REFRESH_TOKEN_KEY, t); }
export function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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

  const res = await fetch(`${getBaseUrl()}/auth/tokens`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${rt}` },
  });

  if (!res.ok) {
    clearToken();
    window.location.href = '/login';
    throw new ApiError(401, '세션이 만료되었습니다. 다시 로그인하세요.');
  }

  const data = await res.json();
  setToken(data.access_token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  return data.access_token;
}

function refreshOnce(): Promise<string> {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => { refreshing = null; });
  }
  return refreshing;
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
  const token = getToken();
  if (!opts.noAuth && token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  // 401 → refresh & retry once
  if (res.status === 401 && !opts.noAuth && retry) {
    try {
      await refreshOnce();
      return request<T>(method, path, opts, false);
    } catch {
      throw new ApiError(401, '세션이 만료되었습니다. 다시 로그인하세요.');
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
