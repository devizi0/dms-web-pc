import { useEffect, useState } from 'react';
import { mealApi, type DayMeal, extractKcal } from '../api/meal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function dateOffset(base: string, offset: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function MealPage() {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [allMeals, setAllMeals] = useState<DayMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedMonth, setLoadedMonth] = useState('');

  const month = selectedDate.slice(0, 7);

  useEffect(() => {
    if (loadedMonth === month) return;
    setLoading(true);
    mealApi.fetchMeals(selectedDate)
      .then(r => { setAllMeals(r?.meals ?? []); setLoadedMonth(month); })
      .catch(() => setAllMeals([]))
      .finally(() => setLoading(false));
  }, [month, selectedDate, loadedMonth]);

  const dayMeal = allMeals.find(m => m.date === selectedDate) ?? null;
  const dayName = DAY_KO[new Date(selectedDate).getDay()];

  const meals = dayMeal
    ? [
        { label: '아침', color: 'orange' as const, items: dayMeal.breakfast },
        { label: '점심', color: 'blue' as const,   items: dayMeal.lunch },
        { label: '저녁', color: 'green' as const,  items: dayMeal.dinner },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">급식</h1>
        <p className="text-sm text-[#6B7684] mt-1">날짜별 급식 메뉴를 확인하세요</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => setSelectedDate(d => dateOffset(d, -1))}>
          <ChevronLeft size={16} />
        </Button>
        <div className="text-center min-w-[160px]">
          <p className="text-lg font-bold text-[#191F28]">{selectedDate}</p>
          <p className="text-sm text-[#6B7684]">{dayName}요일</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setSelectedDate(d => dateOffset(d, 1))}>
          <ChevronRight size={16} />
        </Button>
        {selectedDate !== todayStr() && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(todayStr())}>오늘</Button>
        )}
      </div>

      {loading ? <Loading /> : (
        meals.length === 0
          ? <Card><p className="text-center py-8 text-[#B0B8C1]">이 날의 급식 정보가 없습니다.</p></Card>
          : (
            <div className="grid grid-cols-3 gap-4">
              {meals.map(({ label, color, items }) => {
                const { menu, kcal } = extractKcal(items);
                return (
                  <Card key={label}>
                    <div className="mb-4"><Badge color={color}>{label}</Badge></div>
                    <ul className="space-y-2">
                      {menu.map((item, i) => (
                        <li key={i} className="text-sm text-[#191F28] flex items-start gap-2">
                          <span className="text-[#B0B8C1] shrink-0 mt-0.5">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {kcal && (
                      <p className="mt-4 pt-3 border-t border-[#F2F4F6] text-xs text-[#B0B8C1]">{kcal}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )
      )}
    </div>
  );
}
