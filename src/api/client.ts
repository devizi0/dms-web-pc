const BASE_URL_KEY = 'dms_base_url';
const TOKEN_KEY = 'dms_access_token';

export function getBaseUrl(): string {
  return localStorage.getItem(BASE_URL_KEY) || '';
}
export function setBaseUrl(url: string) {
  localStorage.setItem(BASE_URL_KEY, url.replace(/\/$/, ''));
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  noAuth?: boolean;
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const base = getBaseUrl();
  if (!base) throw new ApiError(0, 'Base URL이 설정되지 않았습니다. 설정 페이지에서 서버 주소를 입력하세요.');

  let url = base + path;
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
