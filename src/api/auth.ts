import {
  clearAccessTokenExpiresAt,
  clearRefreshTokenExpiresAt,
  client,
  setAccessTokenExpiresAt,
  setRefreshToken,
  setRefreshTokenExpiresAt,
  setToken,
} from './client';

export interface SignInResponse {
  access_token: string;
  access_token_expired_at?: string;
  refresh_token: string;
  refresh_token_expired_at?: string;
}

export const authApi = {
  async login(account_id: string, password: string) {
    const res = await client.post<SignInResponse>('/auth/tokens', {
      noAuth: true,
      body: { account_id, password, device_token: 'dms-pc-web' },
    });
    setToken(res.access_token);
    clearAccessTokenExpiresAt();
    if (res.access_token_expired_at) {
      setAccessTokenExpiresAt(res.access_token_expired_at);
    }
    setRefreshToken(res.refresh_token);
    clearRefreshTokenExpiresAt();
    if (res.refresh_token_expired_at) {
      setRefreshTokenExpiresAt(res.refresh_token_expired_at);
    }
    return res;
  },
};
