export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-full bg-[#FFF0F0] flex items-center justify-center text-2xl">⚠️</div>
      <p className="text-sm text-[#F04452] text-center max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-[#3182F6] font-medium hover:underline">
          다시 시도
        </button>
      )}
    </div>
  );
}
