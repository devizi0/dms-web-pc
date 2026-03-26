import { type InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-[#191F28]">{label}</label>}
    <input
      ref={ref}
      className={`h-12 px-4 bg-[#F2F4F6] rounded-xl text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all ${error ? 'border-[#F04452] bg-white' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-[#F04452]">{error}</p>}
  </div>
));
Input.displayName = 'Input';
