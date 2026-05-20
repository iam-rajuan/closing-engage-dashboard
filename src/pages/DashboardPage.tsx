import { useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useToast } from "../components/Toast";
import { MetricsRowSkeleton, ChartSkeleton, QuickActionSkeleton } from "../components/Skeleton";
import { MetricPanel, SectionCard, IconBadge } from "../components/common";
import { useAppContext } from "../context/AppContext";

export function DashboardPage({
  onQuickUser,
  onAssignOrder,
  onApproveDocuments,
}: {
  onQuickUser: () => void;
  onAssignOrder: () => void;
  onApproveDocuments: () => void;
}) {
  const { metrics, chartData, quickActions, isLoading, isChartLoading, error, chartPeriod, setChartPeriod } = useDashboardData();
  const { showToast } = useToast();
  const { adminProfile } = useAppContext();
  const safeMetrics = Array.isArray(metrics) ? metrics : [];
  const safeChartData = Array.isArray(chartData) ? chartData : [];
  const safeQuickActions = Array.isArray(quickActions) ? quickActions : [];

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const firstName = adminProfile.fullName.trim().split(/\s+/)[0] || "Admin";

  const periodLabels: Record<string, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
  };

  if (isLoading && safeMetrics.length === 0 && safeQuickActions.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-7 w-56 rounded-lg" />
            <div className="skeleton-shimmer h-4 w-80 rounded-lg" />
          </div>
          <div className="skeleton-shimmer h-11 w-36 rounded-lg" />
        </div>
        <MetricsRowSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_0.95fr] gap-4">
          <ChartSkeleton />
          <QuickActionSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          Live dashboard data is temporarily unavailable. Showing the last available snapshot or safe fallback values.
        </div>
      ) : null}

      {/* Header with greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-none text-slate-900">{greeting}, {firstName}</h1>
          <p className="mt-2 text-[14px] text-slate-500">{dateStr} · Real-time performance metrics for Closing Engage.</p>
        </div>
      </div>

      {/* Metric Cards — Responsive grid with hover effects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {safeMetrics.map((metric) => (
          <MetricPanel key={metric.title} {...metric} />
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_0.95fr] gap-4">
        {/* Active Users Trend */}
        <SectionCard className="p-5">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">Active Users Trend</h3>
              <p className="mt-1.5 text-[14px] leading-6 text-slate-500">Daily unique engagement across the portal</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-[#EFF3FA] p-1">
              {(["7d", "30d", "90d"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all focus:outline-none ${chartPeriod === period
                    ? "bg-white text-brand-500 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {periodLabels[period]}
                </button>
              ))}
            </div>
          </div>
          <EnhancedChart data={safeChartData} isLoading={isChartLoading} />
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard className="p-5">
          <div className="mb-5">
            <h3 className="text-[18px] font-semibold text-slate-800">Quick Actions</h3>
            <p className="mt-1 text-[13px] text-slate-500">Frequent administrative tasks</p>
          </div>
          <div className="space-y-3">
            {safeQuickActions.map((action) => (
              (() => {
                const ActionIcon = typeof action.icon === "function" ? action.icon : ChevronRight;

                return (
                  <button
                    key={action.title}
                    onClick={
                      action.title === "Add User"
                        ? onQuickUser
                        : action.title === "Assign Orders"
                          ? onAssignOrder
                          : action.title === "Approve Documents"
                            ? onApproveDocuments
                            : () => showToast((action as any).title, { message: (action as any).description, variant: "info" })
                    }
                    className="quick-action-hover flex w-full items-start gap-4 rounded-xl border border-line bg-white px-4 py-4 text-left group focus:outline-none transition-all"
                  >
                    <IconBadge tone={action.tone}>
                      <ActionIcon size={18} />
                    </IconBadge>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-slate-800 group-hover:text-brand-500 transition-colors">
                        {action.title}
                      </div>
                      <div className="max-w-[190px] text-[13px] leading-5 text-slate-500">{action.description}</div>
                    </div>
                    <ChevronRight size={16} className="mt-1 text-slate-300 group-hover:text-brand-400 transition-colors" />
                  </button>
                );
              })()
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/** Trend chart with a smooth line and subtle area fill */
export function EnhancedChart({
  data,
  isLoading,
}: {
  data: { label: string; value: number }[];
  isLoading?: boolean;
}) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data.length) return <div className="h-[240px] flex items-center justify-center text-slate-400">No data available</div>;

  const peakValue = Math.max(...data.map((d) => d.value), 0);
  const maxVal = Math.max(Math.ceil(peakValue * 1.25), 4);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const width = 700;
  const height = 260;
  const padX = 48;
  const padTop = 22;
  const padBottom = 46;
  const chartH = height - padTop - padBottom;
  const chartW = width - padX * 2;

  const points = data.map((d, i) => ({
    label: d.label,
    value: d.value,
    x: padX + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padTop + chartH - ((d.value - minVal) / range) * chartH,
  }));

  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) * 0.35;
      const cpx2 = p.x - (p.x - prev.x) * 0.35;
      return `C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`;

  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round(minVal + (range / ySteps) * i));
  const activeIndex = hoveredPoint ?? points.length - 1;

  return (
    <div
      className="relative h-[300px] overflow-hidden rounded-[24px] border border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_34%),linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] px-2 pt-2"
      onMouseLeave={() => setHoveredPoint(null)}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[24px] bg-white/60 backdrop-blur-[1px] transition-all duration-200">
          <Loader2 className="animate-spin text-brand-500" size={24} />
        </div>
      )}

      <div className="pointer-events-none absolute left-5 top-4 z-10 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Peak Activity</div>
        <div className="mt-0.5 text-[15px] font-semibold text-slate-900">{peakValue.toLocaleString()} users</div>
      </div>

      {hoveredPoint !== null && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-200"
          style={{
            left: `${(points[hoveredPoint].x / width) * 100}%`,
            top: `${(points[hoveredPoint].y / height) * 100}%`,
            transform: "translate(-50%, -145%)",
          }}
        >
          <div className="relative whitespace-nowrap rounded-xl border border-slate-800 bg-slate-950/95 px-3.5 py-2 text-white shadow-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{points[hoveredPoint].label}</div>
            <div className="mt-0.5 text-[13px] font-bold">{points[hoveredPoint].value.toLocaleString()} Users</div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full chart-gradient-fill group cursor-crosshair">
        <defs>
          <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trendStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>

        {yLabels.map((val, i) => {
          const y = padTop + chartH - ((val - minVal) / range) * chartH;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#E7EEF8" strokeWidth="1" strokeDasharray="3 7" />
              <text x={padX - 10} y={y + 4} textAnchor="end" className="fill-slate-400 font-medium" fontSize="11">
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#trendAreaGrad)" />

        <path
          d={linePath}
          fill="none"
          stroke="url(#trendStrokeGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 ease-out"
          style={{ filter: "drop-shadow(0px 8px 16px rgba(37, 99, 235, 0.18))" }}
        />

        {points.map((p, i) => (
          <g key={`${p.label}-${i}`} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(i)}>
            <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredPoint === i || activeIndex === i ? "14" : "0"}
              fill="#2563EB"
              opacity={hoveredPoint === i ? 0.12 : activeIndex === i ? 0.08 : 0}
              className="transition-all duration-200 ease-out"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredPoint === i || activeIndex === i ? "6.5" : "4.5"}
              fill="#ffffff"
              stroke="#2563EB"
              strokeWidth={hoveredPoint === i || activeIndex === i ? "4" : "3"}
              className="transition-all duration-200 ease-out"
            />
          </g>
        ))}

        {points.map((p, i) => (
          <text
            key={`label-${p.label}-${i}`}
            x={p.x}
            y={height - 12}
            textAnchor="middle"
            className={`font-medium transition-all duration-150 ${hoveredPoint === i || activeIndex === i ? "fill-slate-700" : "fill-slate-400"}`}
            fontSize="11"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
