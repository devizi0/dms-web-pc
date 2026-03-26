export function Empty({ text = '데이터가 없습니다', icon }: { text?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-full bg-[#F2F4F6] flex items-center justify-center text-2xl">
        {icon ?? '📭'}
      </div>
      <p className="text-sm text-[#6B7684]">{text}</p>
    </div>
  );
}
