import { type ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, fullWidth, children, disabled, className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';
  const variants = {
    primary:   'bg-[#3182F6] text-white hover:bg-[#1B64DA] active:bg-[#1B64DA]',
    secondary: 'bg-[#F2F4F6] text-[#191F28] hover:bg-[#E5E8EB] active:bg-[#E5E8EB]',
    ghost:     'bg-transparent text-[#6B7684] hover:bg-[#F2F4F6] active:bg-[#F2F4F6]',
    danger:    'bg-[#FFF0F0] text-[#F04452] hover:bg-[#FFE0E0] active:bg-[#FFE0E0]',
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-11 px-5 text-[15px] gap-2',
    lg: 'h-14 px-6 text-base gap-2',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
