import { useEffect, useState } from 'react';
import { pointApi, type PointItem } from '../api/point';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { Empty } from '../components/ui/Empty';
import { TrendingUp, TrendingDown } from 'lucide-react';

type Filter = 'ALL' | 'BONUS' | 'MINUS';

export function PointPage() {
  const [filter] = useState<Filter>('ALL');
  const [items, setItems] = useState<PointItem[]>([]);
  const [totalPoint, setTotalPoint] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pointApi.fetchPoints(filter)
      .then(r => {
        setTotalPoint(r?.total_point ?? 0);
        setItems(r?.point_histories?.length ? r.point_histories : (r?.points ?? []));
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-sm font-medium text-[#6B7684]">내 상점</p>
        <h1 className={`text-3xl font-bold mt-1 tracking-tight ${totalPoint >= 0 ? 'text-[#3182F6]' : 'text-[#F04452]'}`}>
          {totalPoint}점
        </h1>
      </div>

      <Card padding="none">
        {loading ? <Loading /> : items.length === 0 ? <Empty text="내역이 없습니다" icon="📋" /> : (
          <ul className="divide-y divide-[#F2F4F6]">
            {items.map((p, i) => (
              <li key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.point_type === 'BONUS' ? 'bg-[#EBF2FF]' : 'bg-[#FFF0F0]'}`}>
                    {p.point_type === 'BONUS'
                      ? <TrendingUp size={14} className="text-[#3182F6]" />
                      : <TrendingDown size={14} className="text-[#F04452]" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#191F28]">{p.point_name ?? '-'}</p>
                    <p className="text-xs text-[#B0B8C1]">{p.date?.slice(0, 10)}</p>
                  </div>
                 </div>
                 <span className={`text-base font-bold ${p.point_type === 'BONUS' ? 'text-[#3182F6]' : 'text-[#F04452]'}`}>
                  {p.score ?? 0}점
                 </span>
               </li>
             ))}
           </ul>
        )}
      </Card>
    </div>
  );
}
