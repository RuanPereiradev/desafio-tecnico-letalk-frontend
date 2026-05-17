export function DashboardSkeleton() {
  const pulseClass = "bg-zinc-800 animate-pulse rounded-lg";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-48 flex flex-col justify-between">
        <div className="space-y-3">
          <div className={`${pulseClass} h-4 w-32`} />
          <div className={`${pulseClass} h-8 w-3/4`} />
          <div className={`${pulseClass} h-4 w-1/2`} />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          <div className={`${pulseClass} h-4 w-24`} />
          <div className={`${pulseClass} h-4 w-24`} />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col items-center justify-between h-48">
        <div className={`${pulseClass} h-4 w-20`} />
        <div className={`${pulseClass} h-20 w-24 rounded-2xl`} />
        <div className={`${pulseClass} h-3 w-32`} />
      </div>

      <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
        <div className={`${pulseClass} h-3 w-40`} />
        <div className={`${pulseClass} h-4 w-full`} />
        <div className={`${pulseClass} h-4 w-5/6`} />
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
          <div className={`${pulseClass} h-3 w-24`} />
          <div className={`${pulseClass} h-6 w-32`} />
        </div>
      ))}
    </div>
  );
}