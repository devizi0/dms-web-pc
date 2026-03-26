import { client, setToken } from './client';

export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  refresh_token_expired_at: string;
}

export const authApi = {
  signIn(account_id: string, password: string) {
    return client.post<SignInResponse>('/auth/tokens', {
      noAuth: true,
      body: { account_id, password, device_token: 'dms-pc-web' },
    });
  },
  async login(account_id: string, password: string) {
    const res = await authApi.signIn(account_id, password);
    setToken(res.access_token);
    return res;
  },
  sendEmailCode(email: string, type: 'PASSWORD' | 'SIGNUP') {
    return client.post('/auth/code', { noAuth: true, body: { email, type } });
  },
  checkEmailCode(email: string, auth_code: string, type: string) {
    return client.get('/auth/code', { noAuth: true, query: { email, auth_code, type } });
  },
};
