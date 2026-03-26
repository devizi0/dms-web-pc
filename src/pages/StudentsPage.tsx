import { useEffect, useState } from 'react';
import { studentApi, type StudentItem } from '../api/student';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { Empty } from '../components/ui/Empty';
import { Search, User } from 'lucide-react';

export function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    studentApi.fetchStudents()
      .then(r => setStudents(r?.students ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.name.includes(query) || s.gcn.includes(query)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">학생 목록</h1>
        <p className="text-sm text-[#6B7684] mt-1">전체 {students.length}명</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B8C1]" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="이름 또는 학번으로 검색"
          className="w-full h-12 pl-10 pr-4 bg-white rounded-xl text-sm text-[#191F28] placeholder:text-[#B0B8C1] outline-none border-2 border-transparent focus:border-[#3182F6] transition-all"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        />
      </div>

      {loading ? <Loading /> : filtered.length === 0 ? <Empty text="학생이 없습니다" icon="👥" /> : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(s => (
            <Card key={s.id} padding="sm" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] flex items-center justify-center shrink-0 overflow-hidden">
                {s.profile_image_url
                  ? <img src={s.profile_image_url} alt={s.name} className="w-full h-full object-cover" />
                  : <User size={18} className="text-[#3182F6]" />
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#191F28] truncate">{s.name}</p>
                <p className="text-xs text-[#6B7684]">{s.gcn}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
