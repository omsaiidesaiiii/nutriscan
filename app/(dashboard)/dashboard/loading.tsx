export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-zinc-100 rounded-lg" />
        <div className="h-4 w-72 bg-zinc-100 rounded-lg" />
      </div>

      {/* Macro cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-zinc-100">
            <div className="h-3 w-16 bg-zinc-100 rounded mb-3" />
            <div className="h-6 w-20 bg-zinc-100 rounded mb-3" />
            <div className="h-1.5 w-full bg-zinc-100 rounded-full" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white h-[300px] rounded-[2rem] border border-zinc-100" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white h-[100px] rounded-[2rem] border border-zinc-100" />
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white h-[400px] rounded-[2rem] border border-zinc-100" />
        </div>
      </div>
    </div>
  )
}
