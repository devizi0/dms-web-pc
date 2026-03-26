import { useEffect, useState } from 'react';
import { votingApi, type VoteTopic, type VoteOption } from '../api/voting';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Empty } from '../components/ui/Empty';
import { ChevronLeft } from 'lucide-react';

export function VotingPage() {
  const [topics, setTopics] = useState<VoteTopic[]>([]);
  const [selected, setSelected] = useState<VoteTopic | null>(null);
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [optLoading, setOptLoading] = useState(false);
  const [voting, setVoting] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    votingApi.fetchVotes()
      .then(r => setTopics(r?.voting_topics ?? []))
      .finally(() => setLoading(false));
  }, []);

  const openTopic = async (topic: VoteTopic) => {
    setSelected(topic);
    setOptions([]);
    setMsg(null);
    setOptLoading(true);
    try {
      const r = await votingApi.fetchOptions(topic.voting_topic_id);
      setOptions(r?.vote_options ?? []);
    } finally {
      setOptLoading(false);
    }
  };

  const doVote = async (option: VoteOption) => {
    if (!selected) return;
    setVoting(option.voting_option_id);
    setMsg(null);
    try {
      await votingApi.vote(selected.voting_topic_id, option.voting_option_id);
      setMsg({ type: 'success', text: `"${option.name}" 에 투표했습니다.` });
      const r = await votingApi.fetchOptions(selected.voting_topic_id);
      setOptions(r?.vote_options ?? []);
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '투표 실패' });
    } finally {
      setVoting(null);
    }
  };

  const statusColor: Record<string, 'blue' | 'green' | 'gray'> = {
    ONGOING: 'blue', CLOSED: 'gray', DONE: 'green',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">투표</h1>
        <p className="text-sm text-[#6B7684] mt-1">진행 중인 투표에 참여하세요</p>
      </div>

      {selected ? (
        <div className="space-y-4">
          <button
            onClick={() => { setSelected(null); setMsg(null); }}
            className="flex items-center gap-1.5 text-sm text-[#6B7684] hover:text-[#191F28] transition-colors"
          >
            <ChevronLeft size={16} /> 목록으로
          </button>
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-[#191F28] flex-1">{selected.topic}</h2>
              <Badge color={statusColor[selected.status] ?? 'gray'}>{selected.status}</Badge>
            </div>

            {msg && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-[#E8FAF0] text-[#05C072]' : 'bg-[#FFF0F0] text-[#F04452]'}`}>
                {msg.text}
              </div>
            )}

            {optLoading ? <Loading /> : options.length === 0 ? <Empty text="투표 항목이 없습니다" /> : (
              <div className="space-y-3">
                {options.map(opt => {
                  const totalVotes = options.reduce((s, o) => s + (o.vote_count ?? 0), 0);
                  const pct = totalVotes > 0 ? Math.round(((opt.vote_count ?? 0) / totalVotes) * 100) : 0;
                  return (
                    <div key={opt.voting_option_id} className="border border-[#E5E8EB] rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium text-[#191F28]">{opt.name}</span>
                        <div className="flex items-center gap-3">
                          {opt.vote_count !== undefined && (
                            <span className="text-sm text-[#6B7684]">{opt.vote_count}표 ({pct}%)</span>
                          )}
                          {selected.status === 'ONGOING' && (
                            <Button size="sm" variant="secondary" loading={voting === opt.voting_option_id} onClick={() => doVote(opt)}>
                              투표
                            </Button>
                          )}
                        </div>
                      </div>
                      {opt.vote_count !== undefined && (
                        <div className="h-1 bg-[#F2F4F6]">
                          <div className="h-1 bg-[#3182F6] transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      ) : (
        loading ? <Loading /> : topics.length === 0 ? <Empty text="진행 중인 투표가 없습니다" icon="🗳️" /> : (
          <div className="space-y-3">
            {topics.map(t => (
              <Card key={t.voting_topic_id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => openTopic(t)}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#191F28]">{t.topic}</p>
                  <Badge color={statusColor[t.status] ?? 'gray'}>{t.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
