import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getRefreshToken, getToken } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken() || getRefreshToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.login(accountId, password);
      navigate('/', { replace: true });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      <section className="relative flex min-h-[30vh] w-full overflow-hidden bg-[#EAF2FF] lg:min-h-screen lg:w-1/2 lg:flex-1">
        <img
          src="/LoginPattern.svg"
          alt="DMS 로그인 패턴"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      <div className="flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2 lg:flex-none">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#191F28]">로그인</h1>
            <p className="text-base text-[#6B7684]">아이디와 비밀번호를 입력해 주세요.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={accountId}
              onChange={e => setAccountId(e.target.value)}
              autoComplete="username"
              autoFocus
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error}
            />
            <Button type="submit" fullWidth size="lg" loading={loading}>
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
