import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6] p-4">
      <div className="w-full max-w-sm">
        <Card className="space-y-6">
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
  );
}
