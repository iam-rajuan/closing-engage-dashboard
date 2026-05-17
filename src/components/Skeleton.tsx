import React from "react";

/**
 * Skeleton loading placeholders for the dashboard.
 * Uses CSS shimmer animation defined in index.css.
 */

function Shimmer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} style={style} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="panel min-h-[142px] p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Shimmer className="h-12 w-12 rounded-2xl" />
        <Shimmer className="h-5 w-10 rounded-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-6 w-16" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="panel p-5 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-4 w-56" />
        </div>
        <Shimmer className="h-9 w-28 rounded-lg" />
      </div>
      <div className="flex items-end gap-3 h-[200px] pt-8">
        {[60, 80, 95, 110, 90, 75, 100, 85].map((h, i) => (
          <Shimmer
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${h}px` } as any}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-3 w-12" />
        ))}
      </div>
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="panel p-5 space-y-5">
      <div className="space-y-2">
        <Shimmer className="h-5 w-28" />
        <Shimmer className="h-4 w-44" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-xl border border-line px-4 py-4"
        >
          <Shimmer className="h-12 w-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricsRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}
