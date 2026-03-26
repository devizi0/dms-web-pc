import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken } from '../../api/client';
import {
  LayoutDashboard, UtensilsCrossed, Bell,
  Building2, Home, Trophy, Vote, User, LogOut, Settings, Users,
} from 'lucide-react';
import { type StudentProfile } from '../../api/student';

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: '대시보드' },
  { to: '/meal',     icon: UtensilsCrossed, label: '급식' },
  { to: '/notice',   icon: Bell,            label: '공지사항' },
  { to: '/remains',  icon: Home,            label: '잔류 신청' },
  { to: '/point',    icon: Trophy,          label: '상벌점' },
  { to: '/voting',   icon: Vote,            label: '투표' },
  { to: '/students', icon: Users,           label: '학생 목록' },
];

interface SidebarProps {
  profile?: StudentProfile;
  logoutTimeText?: string | null;
  isLogoutTimeLoading?: boolean;
}

export function Sidebar({ profile, logoutTimeText, isLogoutTimeLoading = false }: SidebarProps) {
  const navigate = useNavigate();
  const shouldShowProfileCard = Boolean(profile) || isLogoutTimeLoading;
  const logoutTimeDescription = logoutTimeText
    ? `로그아웃 예정 ${logoutTimeText}`
    : '로그아웃 시간을 확인할 수 없습니다.';

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-[#E5E8EB]">
      <div className="px-6 py-5 border-b border-[#F2F4F6]">
        <span className="text-xl font-bold text-[#3182F6] tracking-tight">DMS</span>
        <span className="text-xs text-[#B0B8C1] ml-1.5">기숙사 관리 시스템</span>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#EBF2FF] text-[#3182F6]'
                  : 'text-[#6B7684] hover:bg-[#F2F4F6] hover:text-[#191F28]'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#F2F4F6] p-3 space-y-1">
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-[#EBF2FF] text-[#3182F6]' : 'text-[#6B7684] hover:bg-[#F2F4F6] hover:text-[#191F28]'
            }`
          }
        >
          <User size={18} strokeWidth={2} />
          마이페이지
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-[#EBF2FF] text-[#3182F6]' : 'text-[#6B7684] hover:bg-[#F2F4F6] hover:text-[#191F28]'
            }`
          }
        >
          <Settings size={18} strokeWidth={2} />
          설정
        </NavLink>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B7684] hover:bg-[#FFF0F0] hover:text-[#F04452] transition-all"
        >
          <LogOut size={18} strokeWidth={2} />
          로그아웃
        </button>

        {shouldShowProfileCard && (
          <div className="mx-1 mt-2 px-3 py-2.5 bg-[#F2F4F6] rounded-xl">
            {profile ? (
              <>
                <p className="text-sm font-semibold text-[#191F28] truncate">{profile.name}</p>
                <p className="text-xs text-[#6B7684]">{profile.gcn} · {profile.school_name}</p>
              </>
            ) : (
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-[#E5E8EB]" />
                <div className="h-3 w-28 animate-pulse rounded bg-[#E5E8EB]" />
              </div>
            )}

            <div className="mt-2 border-t border-white/70 pt-2">
              {isLogoutTimeLoading ? (
                <div className="h-3 w-32 animate-pulse rounded bg-[#E5E8EB]" />
              ) : (
                <p className="text-xs text-[#6B7684]">{logoutTimeDescription}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
