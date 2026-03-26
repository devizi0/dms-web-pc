import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { noticeApi, type Notice, type NoticeDetail } from '../api/notice';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { Empty } from '../components/ui/Empty';
import { ChevronLeft } from 'lucide-react';

export function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticeApi.fetchNotices('NEW')
      .then(r => setNotices(r?.notices ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">공지사항</h1>
        <p className="text-sm text-[#6B7684] mt-1">학교 공지를 확인하세요</p>
      </div>

      <Card padding="none">
        {loading ? <Loading /> : notices.length === 0 ? <Empty text="공지사항이 없습니다" icon="📭" /> : (
          <ul className="divide-y divide-[#F2F4F6]">
            {notices.map(n => (
              <li key={n.id}>
                <Link
                  to={`/notice/${n.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
                >
                  <span className="text-sm text-[#191F28] truncate">{n.title}</span>
                  <span className="text-xs text-[#B0B8C1] ml-6 shrink-0">{n.created_at?.slice(0, 10)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    noticeApi.fetchNoticeDetail(id)
      .then(setNotice)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/notice')}
        className="flex items-center gap-1.5 text-sm text-[#6B7684] hover:text-[#191F28] transition-colors"
      >
        <ChevronLeft size={16} /> 공지사항 목록
      </button>

      {loading ? <Loading /> : !notice ? <Empty text="공지를 찾을 수 없습니다" /> : (
        <Card>
          <p className="text-xs text-[#B0B8C1] mb-2">{notice.created_at?.slice(0, 10)}</p>
          <h1 className="text-xl font-bold text-[#191F28] mb-6">{notice.title}</h1>
          <div className="border-t border-[#F2F4F6] pt-6">
            <p className="text-sm text-[#191F28] leading-relaxed whitespace-pre-wrap">{notice.content}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
