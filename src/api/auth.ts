import { client, setToken, setRefreshToken } from './client';

export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  refresh_token_expired_at: string;
}

export const authApi = {
  async login(account_id: string, password: string) {
    const res = await client.post<SignInResponse>('/auth/tokens', {
      noAuth: true,
      body: { account_id, password, device_token: 'dms-pc-web' },
    });
    setToken(res.access_token);
    setRefreshToken(res.refresh_token);
    return res;
  },
};
