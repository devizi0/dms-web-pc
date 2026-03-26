import { useEffect, useState } from 'react';
import { studentApi, type StudentProfile } from '../api/student';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { User, GraduationCap, School, TrendingUp, TrendingDown } from 'lucide-react';

export function MyPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.fetchProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!profile) return <p className="text-[#6B7684]">프로필을 불러올 수 없습니다.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#191F28]">마이페이지</h1>

      <Card>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF2FF] flex items-center justify-center overflow-hidden shrink-0">
            {profile.profile_image_url
              ? <img src={profile.profile_image_url} alt="프로필" className="w-full h-full object-cover" />
              : <User size={28} className="text-[#3182F6]" />
            }
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#191F28]">{profile.name}</h2>
            <p className="text-sm text-[#6B7684] mt-0.5">{profile.school_name}</p>
            {profile.phrase && <p className="text-xs text-[#B0B8C1] mt-1">"{profile.phrase}"</p>}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={16} className="text-[#3182F6]" />
            <span className="text-sm text-[#6B7684]">학번</span>
          </div>
          <p className="text-2xl font-bold text-[#191F28]">{profile.gcn}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#3182F6]" />
            <span className="text-sm text-[#6B7684]">상점</span>
          </div>
          <p className="text-2xl font-bold text-[#3182F6]">{profile.bonus_point ?? 0}점</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-[#F04452]" />
            <span className="text-sm text-[#6B7684]">벌점</span>
          </div>
          <p className="text-2xl font-bold text-[#F04452]">{profile.minus_point ?? 0}점</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <School size={16} className="text-[#3182F6]" />
          <span className="text-sm text-[#6B7684]">학교</span>
        </div>
        <p className="text-lg font-bold text-[#191F28]">{profile.school_name}</p>
      </Card>
    </div>
  );
}
