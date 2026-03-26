import { useEffect, useState } from 'react';
import { remainsApi, type RemainsOption, type RemainsTime, type MyRemains } from '../api/remains';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

const DAY_KO: Record<string, string> = {
  MONDAY: '월', TUESDAY: '화', WEDNESDAY: '수', THURSDAY: '목',
  FRIDAY: '금', SATURDAY: '토', SUNDAY: '일',
};

export function RemainsPage() {
  const [options, setOptions] = useState<RemainsOption[]>([]);
  const [myRemains, setMyRemains] = useState<MyRemains | null>(null);
  const [appTime, setAppTime] = useState<RemainsTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    await Promise.allSettled([
      remainsApi.fetchOptions().then(r => setOptions(r?.remain_options ?? [])),
      remainsApi.fetchMyRemains().then(setMyRemains).catch(() => setMyRemains(null)),
      remainsApi.fetchApplicationTime().then(setAppTime).catch(() => {}),
    ]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const apply = async (id: string) => {
    setApplying(id);
    setMsg(null);
    try {
      await remainsApi.applyRemains(id);
      setMsg({ type: 'success', text: '잔류 신청이 완료되었습니다.' });
      await load();
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '신청 실패' });
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">잔류 신청</h1>
        {appTime && (
          <p className="text-sm text-[#6B7684] mt-1">
            신청 기간: {DAY_KO[appTime.start_day_of_week]}요일 {appTime.start_time} ~ {DAY_KO[appTime.end_day_of_week]}요일 {appTime.end_time}
          </p>
        )}
      </div>

      {myRemains && (
        <Card className="border-l-4 border-[#3182F6]">
          <p className="text-xs text-[#3182F6] font-semibold mb-1">현재 신청</p>
          <p className="font-bold text-[#191F28]">{myRemains.title}</p>
        </Card>
      )}

      {msg && (
        <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-[#E8FAF0] text-[#05C072]' : 'bg-[#FFF0F0] text-[#F04452]'}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-3">
        {options.map(opt => {
          const isSelected = opt.is_applied || myRemains?.id === opt.id;
          return (
            <Card key={opt.id} className={isSelected ? 'ring-2 ring-[#3182F6]' : ''}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#191F28]">{opt.title}</p>
                    {isSelected && (
                      <span className="text-xs bg-[#EBF2FF] text-[#3182F6] px-2 py-0.5 rounded-full font-medium">선택됨</span>
                    )}
                  </div>
                  {opt.description && <p className="text-sm text-[#6B7684] mt-1">{opt.description}</p>}
                </div>
                <Button
                  variant={isSelected ? 'secondary' : 'primary'}
                  size="sm"
                  loading={applying === opt.id}
                  onClick={() => apply(opt.id)}
                  className="ml-4 shrink-0"
                >
                  {isSelected ? '선택됨' : '신청'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
