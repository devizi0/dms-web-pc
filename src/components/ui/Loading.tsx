import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function Loading({}: { text?: string }) {
  return (
    <div className="w-full space-y-4 py-4">
      <Skeleton height={80} className="rounded-2xl" />
      <Skeleton height={80} className="rounded-2xl" />
      <Skeleton height={80} className="rounded-2xl" />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white z-50 p-6 space-y-6">
      <Skeleton height={40} width="40%" className="rounded-xl" />
      <Skeleton height={120} className="rounded-2xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton height={100} className="rounded-2xl" />
        <Skeleton height={100} className="rounded-2xl" />
        <Skeleton height={100} className="rounded-2xl" />
      </div>
      <div className="space-y-3">
        <Skeleton height={70} className="rounded-2xl" />
        <Skeleton height={70} className="rounded-2xl" />
        <Skeleton height={70} className="rounded-2xl" />
        <Skeleton height={70} className="rounded-2xl" />
      </div>
    </div>
  );
}
