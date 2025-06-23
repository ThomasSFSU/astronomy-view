// Skeleton loader for APOD Card
export function ApodSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-1/2 mx-auto"></div>
      <div className="h-64 bg-slate-800 rounded-xl"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mx-auto"></div>
    </div>
  );
}