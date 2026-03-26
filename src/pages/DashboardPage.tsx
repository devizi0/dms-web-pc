import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mealApi, type DayMeal, extractKcal } from '../api/meal';
import { noticeApi, type Notice } from '../api/notice';
import { studentApi, type StudentProfile } from '../api/student';
import { remainsApi, type MyRemains } from '../api/remains';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, UtensilsCrossed, Bell, Home } from 'lucide-react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [todayMeal, setTodayMeal] = useState<DayMeal | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [myRemains, setMyRemains] = useState<MyRemains | null>(null);

  useEffect(() => {
    const t = today();
    studentApi.fetchProfile().then(setProfile).catch(() => {});
    mealApi.fetchMeals(t)
      .then(r => {
        const found = (r?.meals ?? []).find(m => m.date === t) ?? null;
        setTodayMeal(found);
      })
      .catch(() => {});
    noticeApi.fetchNotices('NEW').then(r => setNotices((r?.notices ?? []).slice(0, 5))).catch(() => {});
    remainsApi.fetchMyRemains().then(setMyRemains).catch(() => {});
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '좋은 아침이에요';
    if (h < 18) return '안녕하세요';
    return '좋은 저녁이에요';
  };

  const meals = todayMeal
    ? [
        { label: '아침', color: 'orange' as const, items: todayMeal.breakfast },
        { label: '점심', color: 'blue' as const,   items: todayMeal.lunch },
        { label: '저녁', color: 'green' as const,  items: todayMeal.dinner },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#6B7684]">{today()} · {greeting()}</p>
        <h1 className="text-2xl font-bold text-[#191F28] mt-0.5">
          {profile ? `${profile.name}님` : '안녕하세요'} 👋
        </h1>
      </div>

      {/* Quick status */}
      <div className="grid grid-cols-1 gap-4 max-w-sm">
        <Link to="/remains">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8FAF0] flex items-center justify-center">
                    <Home size={16} className="text-[#05C072]" />
                  </div>
                  <span className="text-sm font-medium text-[#6B7684]">잔류</span>
                </div>
                {myRemains
                  ? <p className="text-lg font-bold text-[#191F28]">{myRemains.title}</p>
                  : <p className="text-[#B0B8C1] text-sm">신청 내역 없음</p>
                }
              </div>
              <ChevronRight size={16} className="text-[#B0B8C1] mt-1" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Meal */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F2F4F6]">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-[#3182F6]" />
            <h2 className="font-bold text-[#191F28]">오늘의 급식</h2>
          </div>
          <Link to="/meal" className="text-sm text-[#3182F6] font-medium hover:underline flex items-center gap-0.5">
            더보기 <ChevronRight size={14} />
          </Link>
        </div>
        {meals.length === 0 ? (
          <p className="px-6 py-5 text-sm text-[#B0B8C1]">급식 정보가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-3 divide-x divide-[#F2F4F6]">
            {meals.map(({ label, color, items }) => {
              const { menu, kcal } = extractKcal(items);
              return (
                <div key={label} className="px-5 py-4">
                  <Badge color={color}>{label}</Badge>
                  <ul className="mt-3 space-y-1">
                    {menu.map((item, i) => (
                      <li key={i} className="text-sm text-[#191F28] leading-snug">{item}</li>
                    ))}
                  </ul>
                  {kcal && <p className="text-xs text-[#B0B8C1] mt-2">{kcal}</p>}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Notices */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F2F4F6]">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#3182F6]" />
            <h2 className="font-bold text-[#191F28]">공지사항</h2>
          </div>
          <Link to="/notice" className="text-sm text-[#3182F6] font-medium hover:underline flex items-center gap-0.5">
            더보기 <ChevronRight size={14} />
          </Link>
        </div>
        {notices.length === 0 ? (
          <p className="px-6 py-5 text-sm text-[#B0B8C1]">공지사항이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-[#F2F4F6]">
            {notices.map(n => (
              <li key={n.id}>
                <Link
                  to={`/notice/${n.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F9FAFB] transition-colors"
                >
                  <span className="text-sm text-[#191F28] truncate">{n.title}</span>
                  <span className="text-xs text-[#B0B8C1] ml-4 shrink-0">{n.created_at?.slice(0, 10)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
