import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getBaseUrl, setBaseUrl } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const [baseUrl, setBaseUrlState] = useState(getBaseUrl());
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseUrl.trim()) { setError('서버 주소를 입력하세요.'); return; }
    setBaseUrl(baseUrl.trim());
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
    <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3182F6] rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-2xl font-bold text-[#191F28]">DMS</h1>
          <p className="text-sm text-[#6B7684] mt-1">기숙사 관리 시스템</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <Input
            label="서버 주소"
            type="url"
            placeholder="https://api.example.com"
            value={baseUrl}
            onChange={e => setBaseUrlState(e.target.value)}
          />
          <Input
            label="아이디"
            placeholder="아이디를 입력하세요"
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
            autoComplete="username"
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
          <div className="pt-1">
            <Button type="submit" fullWidth size="lg" loading={loading}>
              로그인
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
