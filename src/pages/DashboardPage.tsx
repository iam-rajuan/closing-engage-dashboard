import { useState } from "react";
import { Download, Loader2, ChevronRight } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useToast } from "../components/Toast";
import { exportDashboardReport } from "../api/dashboardService";
import { MetricsRowSkeleton, ChartSkeleton, QuickActionSkeleton } from "../components/Skeleton";
import { MetricPanel, SectionCard, IconBadge } from "../components/common";
import { quickActions } from "../data";

export function DashboardPage({
  onQuickUser,
  onAssignOrder,
  onApproveDocuments,
}: {
  onQuickUser: () => void;
  onAssignOrder: () => void;
  onApproveDocuments: () => void;
}) {
  const { metrics, chartData, isLoading, isChartLoading, chartPeriod, setChartPeriod } = useDashboardData();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportDashboardReport("pdf");
      if (result.success) {
        showToast("Report exported successfully", { message: result.fileName, variant: "success" });
      }
    } catch {
      showToast("Export failed", { message: "Please try again later.", variant: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const periodLabels: Record<string, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
  };

  if (isLoading) {
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
      {/* Header with greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-none text-slate-900">{greeting}, Alex</h1>
          <p className="mt-2 text-[14px] text-slate-500">{dateStr} · Real-time performance metrics for Closing Engage.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,214,0.22)] transition-all hover:bg-brand-600 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
        >
          {isExporting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download size={15} />
              Export Report
            </>
          )}
        </button>
      </div>

      {/* Metric Cards — Responsive grid with hover effects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <MetricPanel key={metric.title} {...metric} />
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_0.95fr] gap-4">
        {/* Active Users Trend */}
        <SectionCard className="p-5">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-800">Active Users Trend</h3>
              <p className="mt-1 text-[13px] text-slate-500">Daily unique engagement across the portal</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-[#EFF3FA] p-1">
              {(["7d", "30d", "90d"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all focus:outline-none ${
                    chartPeriod === period
                      ? "bg-white text-brand-500 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {periodLabels[period]}
                </button>
              ))}
            </div>
          </div>
          <EnhancedChart data={chartData} isLoading={isChartLoading} />
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard className="p-5">
          <div className="mb-5">
            <h3 className="text-[18px] font-semibold text-slate-800">Quick Actions</h3>
            <p className="mt-1 text-[13px] text-slate-500">Frequent administrative tasks</p>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => (
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
                  <action.icon size={18} />
                </IconBadge>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-slate-800 group-hover:text-brand-500 transition-colors">
                    {action.title}
                  </div>
                  <div className="max-w-[190px] text-[13px] leading-5 text-slate-500">{action.description}</div>
                </div>
                <ChevronRight size={16} className="mt-1 text-slate-300 group-hover:text-brand-400 transition-colors" />
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/** Enhanced Area Chart with animated gradient fill + grid lines */
export function EnhancedChart({
  data,
  isLoading,
}: {
  data: { label: string; value: number }[];
  isLoading?: boolean;
}) {
  if (!data.length) return <div className="h-[240px] flex items-center justify-center text-slate-400">No data available</div>;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const width = 620;
  const height = 200;
  const padX = 30;
  const padTop = 20;
  const padBottom = 30;
  const chartH = height - padTop - padBottom;
  const chartW = width - padX * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - ((d.value - minVal) / range) * chartH,
  }));

  // Create smooth cubic bezier path
  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) * 0.4;
      const cpx2 = p.x - (p.x - prev.x) * 0.4;
      return `C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padBottom} L${points[0].x},${height - padBottom} Z`;

  // Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round(minVal + (range / ySteps) * i));

  return (
    <div className="relative h-[240px]">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px] transition-all duration-200">
          <Loader2 className="animate-spin text-brand-500" size={24} />
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full chart-gradient-fill">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563D6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563D6" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {yLabels.map((val, i) => {
          const y = padTop + chartH - ((val - minVal) / range) * chartH;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#E5EAF3" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padX - 6} y={y + 4} textAnchor="end" className="fill-slate-400 font-semibold" fontSize="10">
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}
        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563D6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chart-line-draw"
          style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
        />
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#2563D6" strokeWidth="2" />
            <title>
              {data[i].label}: {data[i].value.toLocaleString()}
            </title>
          </g>
        ))}
      </svg>
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-[30px] right-[30px] flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="text-[11px] font-semibold text-slate-400">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
