import { clearToken, getToken } from '../api/client';

type Listener = () => void;
const listeners = new Set<Listener>();

export const authStore = {
  isLoggedIn: () => !!getToken(),
  logout() {
    clearToken();
    listeners.forEach(l => l());
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
