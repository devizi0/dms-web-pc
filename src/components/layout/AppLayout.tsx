import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getToken } from '../../api/client';
import { studentApi, type StudentProfile } from '../../api/student';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (!getToken()) { navigate('/login', { replace: true }); return; }
    studentApi.fetchProfile().then(setProfile).catch(() => {});
  }, [navigate]);

  if (!getToken()) return null;

  return (
    <div className="flex min-h-screen bg-[#F2F4F6]">
      <Sidebar profile={profile ?? undefined} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
