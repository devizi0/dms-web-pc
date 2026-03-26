import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ApiError, getRefreshToken, getRefreshTokenExpiresAt, getToken, recoverSession } from '../../api/client';
import { studentApi, type StudentProfile } from '../../api/student';
import { Button } from '../ui/Button';
import { Sidebar } from './Sidebar';

type BootstrapState = 'loading' | 'ready' | 'error';

function formatLogoutTime(expiresAt: string | null): string | null {
  if (!expiresAt) {
    return null;
  }

  const expiresAtTime = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtTime)) {
    return null;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(expiresAtTime));
}

export function AppLayout() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>('loading');
  const [bootstrapError, setBootstrapError] = useState('');
  const [bootstrapVersion, setBootstrapVersion] = useState(0);
  const logoutTimeText = formatLogoutTime(getRefreshTokenExpiresAt());
  const isBootstrapLoading = bootstrapState === 'loading';

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setBootstrapState('loading');
      setBootstrapError('');

      const accessToken = getToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        navigate('/login', { replace: true });
        return;
      }

      if (!accessToken && refreshToken) {
        try {
          await recoverSession();
        } catch (error) {
          if (cancelled) return;

          if (error instanceof ApiError && error.status === 401) {
            navigate('/login', { replace: true });
            return;
          }

          setBootstrapError(error instanceof Error ? error.message : '세션을 확인하지 못했습니다.');
          setBootstrapState('error');
          return;
        }
      }

      try {
        const nextProfile = await studentApi.fetchProfile();
        if (!cancelled) {
          setProfile(nextProfile);
          setBootstrapState('ready');
        }
      } catch (error) {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 401) {
          navigate('/login', { replace: true });
          return;
        }

        setBootstrapError(error instanceof Error ? error.message : '사용자 정보를 불러오지 못했습니다.');
        setBootstrapState('error');
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [bootstrapVersion, navigate]);

  if (bootstrapState === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6] px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-[#191F28]">세션을 복구하지 못했습니다.</p>
          <p className="mt-2 text-sm text-[#6B7684]">{bootstrapError}</p>
          <div className="mt-5">
            <Button type="button" fullWidth onClick={() => setBootstrapVersion(current => current + 1)}>
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F2F4F6]">
      <Sidebar
        profile={profile ?? undefined}
        logoutTimeText={logoutTimeText}
        isLogoutTimeLoading={isBootstrapLoading}
      />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {isBootstrapLoading ? (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
              <div className="text-center">
                <p className="text-base font-semibold text-[#191F28]">세션을 확인하는 중입니다.</p>
                <p className="mt-2 text-sm text-[#6B7684]">저장된 로그인 정보를 불러오고 있습니다.</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
