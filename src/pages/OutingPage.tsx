import { useEffect, useState } from 'react';
import { outingApi, type OutingApplication } from '../api/outing';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';

export function OutingPage() {
  const [types, setTypes] = useState<string[]>([]);
  const [myOuting, setMyOuting] = useState<OutingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    outing_type: '',
    date: new Date().toISOString().slice(0, 10),
    start_time: '',
    end_time: '',
    reason: '',
  });

  const load = async () => {
    setLoading(true);
    await Promise.allSettled([
      outingApi.fetchTypes().then(r => {
        const t = r?.titles ?? [];
        setTypes(t);
        if (t.length > 0) setForm(f => ({ ...f, outing_type: t[0] }));
      }),
      outingApi.fetchMyOuting().then(setMyOuting).catch(() => setMyOuting(null)),
    ]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      await outingApi.applyOuting(form);
      setMsg({ type: 'success', text: '외출 신청이 완료되었습니다.' });
      await load();
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '신청 실패' });
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = async () => {
    if (!myOuting) return;
    setCancelling(true);
    try {
      await outingApi.cancelOuting(myOuting.outing_application_id);
      setMsg({ type: 'success', text: '외출 신청이 취소되었습니다.' });
      await load();
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '취소 실패' });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">외출 신청</h1>
        <p className="text-sm text-[#6B7684] mt-1">외출 신청 및 현황을 확인하세요</p>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-[#E8FAF0] text-[#05C072]' : 'bg-[#FFF0F0] text-[#F04452]'}`}>
          {msg.text}
        </div>
      )}

      {myOuting && (
        <Card className="border-l-4 border-[#FF6B00]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#FF6B00] font-semibold mb-1">현재 외출 신청</p>
              <p className="font-bold text-[#191F28]">{myOuting.outing_type}</p>
              <p className="text-sm text-[#6B7684] mt-1">
                {myOuting.date} · {myOuting.start_time} ~ {myOuting.end_time}
              </p>
              {myOuting.reason && <p className="text-sm text-[#6B7684]">사유: {myOuting.reason}</p>}
            </div>
            <div className="flex items-center gap-2">
              {myOuting.status && <Badge color="orange">{myOuting.status}</Badge>}
              <Button variant="danger" size="sm" loading={cancelling} onClick={cancel}>취소</Button>
            </div>
          </div>
        </Card>
      )}

      {!myOuting && (
        <Card>
          <h2 className="font-bold text-[#191F28] mb-5">외출 신청하기</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#191F28]">외출 종류</label>
              <select
                value={form.outing_type}
                onChange={e => setForm(f => ({ ...f, outing_type: e.target.value }))}
                className="h-12 px-4 bg-[#F2F4F6] rounded-xl text-[15px] text-[#191F28] outline-none border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="날짜" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="출발 시간" type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} required />
              <Input label="귀교 시간" type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#191F28]">사유 (선택)</label>
              <textarea
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                rows={3}
                placeholder="외출 사유를 입력하세요"
                className="px-4 py-3 bg-[#F2F4F6] rounded-xl text-sm text-[#191F28] placeholder:text-[#B0B8C1] outline-none border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all resize-none"
              />
            </div>
            <Button type="submit" fullWidth loading={submitting}>신청하기</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
