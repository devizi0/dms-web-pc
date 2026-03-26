import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getRefreshToken, getToken } from '../api/client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
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
    <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6] p-4 lg:p-8">
      <div className="flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <section className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-3xl bg-[#EAF2FF] px-6 py-8 sm:min-h-[360px] sm:px-8 sm:py-10 lg:min-h-[640px] lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.88),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(49,130,246,0.14),_transparent_40%)]" />
          <Card padding="sm" className="relative w-full max-w-[560px]">
            <img
              src="/LoginPattern.svg"
              alt="DMS 로그인 패턴"
              className="block h-auto w-full"
            />
          </Card>
        </section>

        <div className="w-full lg:max-w-sm lg:shrink-0">
          <Card className="space-y-6 sm:p-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#191F28]">로그인</h1>
              <p className="text-sm text-[#6B7684]">아이디와 비밀번호를 입력해 주세요.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
