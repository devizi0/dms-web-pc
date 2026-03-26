interface Props {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'gray';
}

export function Badge({ children, color = 'blue' }: Props) {
  const colors = {
    blue:   'bg-[#EBF2FF] text-[#3182F6]',
    green:  'bg-[#E8FAF0] text-[#05C072]',
    red:    'bg-[#FFF0F0] text-[#F04452]',
    orange: 'bg-[#FFF3E0] text-[#FF6B00]',
    gray:   'bg-[#F2F4F6] text-[#6B7684]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}
