import { useEffect, useState } from "react";
import { MoreVertical, FileText, ClipboardList, CheckCircle2, FolderOpen, UserCog, Building2, Loader2 } from "lucide-react";

import { fetchAnalyticsOverview, type AnalyticsOverview } from "../api/dashboardService";
import { MetricPanel, SectionCard } from "../components/common";
import { useToast } from "../components/Toast";
import type { PageKey } from "../types";

type RangeKey = "today" | "7d" | "30d" | "custom";

const RANGE_OPTIONS: Array<{ key: RangeKey; label: string }> = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "custom", label: "Custom range" },
];

const formatCount = (value: number): string => value.toLocaleString("en-US");

const todayDateInput = (): string => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const subtractDaysInput = (days: number): string => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
};

export function AnalyticsPage({ onNavigate }: { onNavigate?: (page: PageKey) => void }) {
  const { showToast } = useToast();
  const [activeRange, setActiveRange] = useState<RangeKey>("30d");
  const [customStartDate, setCustomStartDate] = useState(subtractDaysInput(29));
  const [customEndDate, setCustomEndDate] = useState(todayDateInput());
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingCustomRange, setIsApplyingCustomRange] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAnalytics = async (
    range: RangeKey,
    options?: {
      startDate?: string;
      endDate?: string;
      silent?: boolean;
      isCustomApply?: boolean;
    },
  ) => {
    const { startDate, endDate, silent = false, isCustomApply = false } = options ?? {};

    if (isCustomApply) {
      setIsApplyingCustomRange(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const overview = await fetchAnalyticsOverview({
        range,
        startDate,
        endDate,
      });
      setAnalytics(overview);

      if (!silent) {
        const selectedLabel = RANGE_OPTIONS.find((option) => option.key === range)?.label ?? "Selected range";
        showToast("Filter Applied", {
          message: `Analytics view set to ${selectedLabel}.`,
          variant: "success",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load analytics right now.";
      setErrorMessage(message);
      showToast("Analytics unavailable", { message, variant: "error" });
    } finally {
      setIsLoading(false);
      setIsApplyingCustomRange(false);
    }
  };

  useEffect(() => {
    if (activeRange === "custom") return;
    void loadAnalytics(activeRange, { silent: true });
  }, [activeRange]);

  const handleRangeChange = (range: RangeKey) => {
    setActiveRange(range);
  };

  const handleApplyCustomRange = async () => {
    if (!customStartDate || !customEndDate) {
      showToast("Missing dates", { message: "Choose both a start date and end date.", variant: "error" });
      return;
    }

    if (customStartDate > customEndDate) {
      showToast("Invalid range", { message: "The end date must be after the start date.", variant: "error" });
      return;
    }

    await loadAnalytics("custom", {
      startDate: customStartDate,
      endDate: customEndDate,
      isCustomApply: true,
    });
  };

  const metrics = analytics
    ? [
        {
          title: "Total Orders",
          value: formatCount(analytics.metrics.totalOrders.value),
          note: analytics.metrics.totalOrders.note,
          tone: "blue" as const,
          icon: ClipboardList,
        },
        {
          title: "Completed",
          value: formatCount(analytics.metrics.completedOrders),
          tone: "blue" as const,
          icon: CheckCircle2,
        },
        {
          title: "Pending Orders",
          value: formatCount(analytics.metrics.pendingOrders),
          tone: "amber" as const,
          icon: FolderOpen,
        },
        {
          title: "Active Notaries",
          value: formatCount(analytics.metrics.activeNotaries),
          tone: "slate" as const,
          icon: UserCog,
        },
        {
          title: "Title Companies",
          value: formatCount(analytics.metrics.titleCompanies),
          tone: "slate" as const,
          icon: Building2,
        },
      ]
    : [];

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col gap-3 overflow-hidden">
      <div className="flex flex-shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-none text-slate-900">Analytics</h1>
          <p className="mt-1.5 text-[13px] text-slate-500">Track system performance and insights</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-1 rounded-full border border-[#E2E8F0] bg-white p-1 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => handleRangeChange(option.key)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all focus:outline-none ${
                  activeRange === option.key
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {activeRange === "custom" ? (
            <div className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <input
                type="date"
                value={customStartDate}
                onChange={(event) => setCustomStartDate(event.target.value)}
                className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-medium text-slate-700 outline-none focus:border-brand-400"
              />
              <span className="text-[12px] font-semibold text-slate-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(event) => setCustomEndDate(event.target.value)}
                className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-medium text-slate-700 outline-none focus:border-brand-400"
              />
              <button
                onClick={() => void handleApplyCustomRange()}
                disabled={isApplyingCustomRange}
                className="inline-flex items-center rounded-lg bg-brand-500 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplyingCustomRange ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {errorMessage && !analytics ? (
        <SectionCard className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <div className="text-[16px] font-semibold text-slate-800">Analytics could not be loaded</div>
            <div className="mt-2 text-[13px] text-slate-500">{errorMessage}</div>
            <button
              onClick={() =>
                void loadAnalytics(activeRange, {
                  startDate: activeRange === "custom" ? customStartDate : undefined,
                  endDate: activeRange === "custom" ? customEndDate : undefined,
                })
              }
              className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-600"
            >
              Retry
            </button>
          </div>
        </SectionCard>
      ) : (
        <>
          <div className="grid flex-shrink-0 grid-cols-5 gap-3">
            {isLoading && !analytics
              ? Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="h-[108px] animate-pulse rounded-xl border border-[#E2E8F0] bg-white p-4" />
                ))
              : metrics.map((metric) => <MetricPanel key={`${activeRange}-${metric.title}`} {...metric} />)}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
            <SectionCard className="flex flex-col p-3 pb-2.5">
              <div className="flex flex-shrink-0 items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">Orders by Status</h3>
                  <p className="mt-0.5 text-[12px] text-slate-500">Live order counts across each workflow status</p>
                </div>
                <button className="rounded-md p-1 text-slate-400 transition-colors hover:bg-[#F5F8FD] hover:text-slate-600 focus:outline-none">
                  <MoreVertical size={15} />
                </button>
              </div>
              <div className="min-h-0 flex-1 mt-2.5">
                <AnalyticsBarChart data={analytics?.ordersByStatus ?? []} isLoading={isLoading} />
              </div>
            </SectionCard>

            <SectionCard className="flex flex-col p-3 pb-2.5">
              <div className="flex flex-shrink-0 items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">Orders Trend</h3>
                  <p className="mt-0.5 text-[12px] text-slate-500">Order volume over the selected date range</p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                  {RANGE_OPTIONS.find((option) => option.key === activeRange)?.label}
                </div>
              </div>
              <div className="min-h-0 flex-1 mt-2.5">
                <AnalyticsLineChart data={analytics?.ordersTrend ?? []} isLoading={isLoading} />
              </div>
            </SectionCard>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
            <SectionCard className="flex flex-col p-3 pb-2.5">
              <div className="flex items-center justify-between px-2.5 py-1.5 flex-shrink-0">
                <h3 className="text-[15px] font-bold text-slate-900">Notary Performance</h3>
                <button
                  onClick={() => onNavigate?.("usersNotaries")}
                  className="text-[12px] font-bold text-brand-500 hover:text-brand-600 transition"
                >
                  View All
                </button>
              </div>
              
              <div className="flex flex-col gap-1.5 flex-1 mt-2">
                {/* Headers */}
                <div className="flex items-center justify-between px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-slate-400 bg-slate-50 border border-slate-100/80 rounded-xl mb-0.5 shadow-[inset_0_1px_2px_rgba(241,245,249,0.5)]">
                  <span>Notary Name</span>
                  <div className="flex items-center gap-12">
                    <span className="hidden sm:inline">Volume Trend</span>
                    <span className="w-16 text-right">Completed</span>
                  </div>
                </div>

                {/* Items */}
                {(analytics?.topNotaries ?? []).length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200/60 rounded-xl bg-slate-50/20 my-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 shadow-sm mb-3">
                      <UserCog size={18} />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-700">No Notary Activity</span>
                    <span className="mt-1 text-[11px] text-slate-400 max-w-[240px]">There is no completed notary activity recorded within the selected date range.</span>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const topNotaries = analytics?.topNotaries ?? [];
                      const maxNotaryOrders = Math.max(...topNotaries.map(n => n.completedOrders), 1);
                      
                      return topNotaries.map((notary, index) => {
                        const pct = (notary.completedOrders / maxNotaryOrders) * 100;
                        const initialColors = 
                          index === 0 ? "bg-gradient-to-tr from-brand-500 to-blue-600 text-white shadow-sm" : 
                          index === 1 ? "bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-sm" :
                          "bg-gradient-to-tr from-slate-400 to-slate-500 text-white shadow-sm";

                        return (
                          <div 
                            key={notary.id} 
                            className="group/notary flex items-center justify-between bg-white border border-slate-100 hover:border-brand-200/60 py-1.5 px-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(15,23,42,0.02)] cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold tracking-wider ${initialColors}`}>
                                {notary.initials}
                              </div>
                              <span className="text-[12px] font-semibold text-slate-800 group-hover/notary:text-brand-600 transition-colors">{notary.name}</span>
                            </div>

                            <div className="flex items-center gap-12">
                              {/* Relative Progress Bar */}
                              <div className="hidden sm:flex items-center h-1.5 w-28 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500 ease-out origin-left scale-x-100"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              <span className="w-16 text-right text-[13px] font-extrabold text-slate-800">{formatCount(notary.completedOrders)}</span>
                            </div>
                          </div>
                        );
                      });
                    })()}

                    {/* Dashboard filler slots up to 3 items */}
                    {Array.from({ length: Math.max(0, 3 - (analytics?.topNotaries ?? []).length) }).map((_, i) => (
                      <div 
                        key={`empty-notary-${i}`} 
                        className="flex items-center justify-between border border-dashed border-slate-100 rounded-xl px-4 py-1.5 text-[11.5px] text-slate-400 min-h-[44px] bg-slate-50/5 hover:bg-slate-50/20 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-full bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center font-bold text-slate-400 text-[10px]">+</div>
                          <span className="font-medium italic text-slate-400">Available slot</span>
                        </div>
                        <span className="font-semibold text-slate-300">—</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard className="flex flex-col p-3 pb-2.5">
              <div className="flex items-center justify-between px-2.5 py-1.5 flex-shrink-0">
                <h3 className="text-[15px] font-bold text-slate-900">Title Company Activity</h3>
                <button
                  onClick={() => onNavigate?.("usersCompanies")}
                  className="text-[12px] font-bold text-brand-500 hover:text-brand-600 transition"
                >
                  Full List
                </button>
              </div>
              
              <div className="flex flex-col gap-1.5 flex-1 mt-2">
                {/* Headers */}
                <div className="flex items-center justify-between px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-slate-400 bg-slate-50 border border-slate-100/80 rounded-xl mb-0.5 shadow-[inset_0_1px_2px_rgba(241,245,249,0.5)]">
                  <span>Title Company</span>
                  <div className="flex items-center gap-12">
                    <span className="hidden sm:inline">Activity Volume</span>
                    <span className="w-16 text-right">Orders</span>
                  </div>
                </div>

                {/* Items */}
                {(analytics?.topCompanies ?? []).length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200/60 rounded-xl bg-slate-50/20 my-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 shadow-sm mb-3">
                      <Building2 size={18} />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-700">No Company Activity</span>
                    <span className="mt-1 text-[11px] text-slate-400 max-w-[240px]">There is no title company order activity recorded within the selected date range.</span>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const topCompanies = analytics?.topCompanies ?? [];
                      const maxCompanyOrders = Math.max(...topCompanies.map(c => c.orderCount), 1);

                      return topCompanies.map((company, index) => {
                        const pct = (company.orderCount / maxCompanyOrders) * 100;
                        const iconColors = 
                          index === 0 ? "bg-[#EEF9F0] text-[#30A35A]" : 
                          index === 1 ? "bg-[#EEF5FF] text-brand-500" :
                          "bg-[#FFF8EE] text-[#D4882F]";

                        return (
                          <div 
                            key={company.id} 
                            className="group/company flex items-center justify-between bg-white border border-slate-100 hover:border-brand-200/60 py-1.5 px-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(15,23,42,0.02)] cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`rounded-lg p-1.5 transition-colors duration-300 ${iconColors}`}>
                                <FileText size={13.5} />
                              </div>
                              <div>
                                <div className="text-[12px] font-bold text-slate-800 group-hover/company:text-brand-600 transition-colors">{company.name}</div>
                                <div className="text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-400 mt-0.5">
                                  {company.subtitle}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-12">
                              {/* Relative Progress Bar */}
                              <div className="hidden sm:flex items-center h-1.5 w-28 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out origin-left scale-x-100"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              <div className="w-16 text-right">
                                <span className="text-[13px] font-extrabold text-slate-800">{formatCount(company.orderCount)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}

                    {/* Dashboard filler slots up to 3 items */}
                    {Array.from({ length: Math.max(0, 3 - (analytics?.topCompanies ?? []).length) }).map((_, i) => (
                      <div 
                        key={`empty-company-${i}`} 
                        className="flex items-center justify-between border border-dashed border-slate-100 rounded-xl px-4 py-1.5 text-[11.5px] text-slate-400 min-h-[44px] bg-slate-50/5 hover:bg-slate-50/20 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-lg bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center font-bold text-slate-400 text-[10px]">+</div>
                          <div className="leading-tight">
                            <span className="font-medium italic text-slate-400">Available slot</span>
                            <div className="text-[8.5px] text-slate-400">No recent activity</div>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-300">—</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticsBarChart({
  data,
  isLoading,
}: {
  data: AnalyticsOverview["ordersByStatus"];
  isLoading?: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return <div className="mt-2 h-full animate-pulse rounded-xl bg-[#F8FAFC]" />;
  }

  if (!data.length) {
    return <div className="flex h-full items-center justify-center text-[13px] text-slate-400">No status data available.</div>;
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const getStatusStyles = (label: string) => {
    const norm = label.toUpperCase();
    if (norm.includes("RECEIVED")) {
      return {
        bg: "from-blue-500 to-blue-600",
        glow: "shadow-[0_4px_12px_rgba(37,99,235,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(37,99,235,0.35)]",
        text: "text-blue-500 group-hover/bar:text-blue-600",
        bgLight: "bg-blue-50/50 border-blue-100/30",
      };
    }
    if (norm.includes("ASSIGNED")) {
      return {
        bg: "from-sky-500 to-indigo-500",
        glow: "shadow-[0_4px_12px_rgba(14,165,233,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(14,165,233,0.35)]",
        text: "text-sky-600 group-hover/bar:text-sky-700",
        bgLight: "bg-sky-50/40 border-sky-100/30",
      };
    }
    if (norm.includes("PROGRESS")) {
      return {
        bg: "from-violet-500 to-fuchsia-600",
        glow: "shadow-[0_4px_12px_rgba(139,92,246,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(139,92,246,0.35)]",
        text: "text-violet-600 group-hover/bar:text-violet-700",
        bgLight: "bg-violet-50/40 border-violet-100/30",
      };
    }
    if (norm.includes("REVIEW")) {
      return {
        bg: "from-amber-500 to-orange-500",
        glow: "shadow-[0_4px_12px_rgba(245,158,11,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(245,158,11,0.35)]",
        text: "text-amber-600 group-hover/bar:text-amber-700",
        bgLight: "bg-amber-50/40 border-amber-100/30",
      };
    }
    if (norm.includes("APPROVED")) {
      return {
        bg: "from-teal-400 to-emerald-500",
        glow: "shadow-[0_4px_12px_rgba(20,184,166,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(20,184,166,0.35)]",
        text: "text-teal-600 group-hover/bar:text-teal-700",
        bgLight: "bg-teal-50/40 border-teal-100/30",
      };
    }
    if (norm.includes("COMPLETED")) {
      return {
        bg: "from-emerald-500 to-green-600",
        glow: "shadow-[0_4px_12px_rgba(16,185,129,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(16,185,129,0.35)]",
        text: "text-emerald-600 group-hover/bar:text-emerald-700",
        bgLight: "bg-emerald-50/40 border-emerald-100/30",
      };
    }
    if (norm.includes("REJECTED")) {
      return {
        bg: "from-rose-500 to-red-500",
        glow: "shadow-[0_4px_12px_rgba(244,63,94,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(244,63,94,0.35)]",
        text: "text-rose-600 group-hover/bar:text-rose-700",
        bgLight: "bg-rose-50/40 border-rose-100/30",
      };
    }
    if (norm.includes("UPLOAD")) {
      return {
        bg: "from-sky-400 to-blue-500",
        glow: "shadow-[0_4px_12px_rgba(56,189,248,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(56,189,248,0.35)]",
        text: "text-sky-600 group-hover/bar:text-sky-700",
        bgLight: "bg-sky-50/30 border-sky-100/20",
      };
    }
    if (norm.includes("SUBMITTED")) {
      return {
        bg: "from-slate-500 to-slate-600",
        glow: "shadow-[0_4px_12px_rgba(100,116,139,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(100,116,139,0.35)]",
        text: "text-slate-500 group-hover/bar:text-slate-600",
        bgLight: "bg-slate-50/50 border-slate-100/30",
      };
    }
    return {
      bg: "from-brand-500 to-brand-600",
      glow: "shadow-[0_4px_12px_rgba(37,99,235,0.15)] group-hover/bar:shadow-[0_6px_20px_rgba(37,99,235,0.35)]",
      text: "text-brand-500 group-hover/bar:text-brand-600",
      bgLight: "bg-slate-50 border-slate-100/30",
    };
  };

  return (
    <div className="relative mt-2 h-full">
      {/* Grid Lines */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-[26px] pt-1">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="w-full border-t border-dashed border-slate-100/60" />
        ))}
      </div>

      {/* Columns Container */}
      <div className="relative z-10 flex h-[calc(100%-24px)] items-stretch justify-between gap-1 px-1">
        {data.map((item, index) => {
          const styles = getStatusStyles(item.shortLabel);
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;
          const isDimmed = isAnyHovered && !isHovered;

          // Tooltip horizontal alignment to prevent clipping on boundaries
          let tooltipAlign = "left-1/2 -translate-x-1/2";
          let arrowAlign = "left-1/2 -translate-x-1/2";
          if (index === 0) {
            tooltipAlign = "left-[4px]";
            arrowAlign = "left-[20px]";
          } else if (index === data.length - 1) {
            tooltipAlign = "right-[4px]";
            arrowAlign = "right-[20px]";
          }

          return (
            <div
              key={`${item.label}-${index}`}
              className={`group/bar relative flex flex-1 cursor-pointer flex-col items-center justify-end h-full gap-2 transition-all duration-300 ${
                isDimmed ? "opacity-45 scale-[0.97]" : "opacity-100 scale-100"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className={`absolute -top-12 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-200 ${tooltipAlign}`}
                >
                  <div className="relative whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl">
                    {formatCount(item.value)} Orders
                    <div
                      className={`absolute -bottom-1 h-2 w-2 rotate-45 bg-slate-900 ${arrowAlign}`}
                    />
                  </div>
                </div>
              )}

              {/* Bar and Track Container */}
              <div className="relative w-full max-w-[28px] sm:max-w-[32px] flex-1 flex flex-col justify-end min-h-[110px]">
                {/* Background Track (Ghost Bar) */}
                <div className={`absolute inset-0 rounded-t-[10px] border border-dashed transition-colors duration-300 ${
                  isHovered ? "bg-slate-100/80 border-slate-200/50" : `${styles.bgLight} border-slate-100/30`
                }`} />

                {/* Actual Bar */}
                <div
                  className={`relative w-full rounded-t-[8px] bg-gradient-to-t ${styles.bg} ${styles.glow} transition-all duration-500 ease-out origin-bottom ${
                    isHovered ? "scale-y-[1.03]" : ""
                  }`}
                  style={{
                    height: `${Math.max((item.value / maxValue) * 100, 4)}%`,
                  }}
                >
                  {/* Subtle inner highlight/glossy top layer */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-white/20 rounded-t-[8px]" />
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-center text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.04em] sm:tracking-[0.06em] whitespace-nowrap transition-colors duration-200 ${
                  isHovered ? styles.text : "text-slate-400"
                }`}
              >
                {item.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsLineChart({
  data,
  isLoading,
}: {
  data: AnalyticsOverview["ordersTrend"];
  isLoading?: boolean;
}) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (isLoading) {
    return <div className="mt-2 h-full animate-pulse rounded-xl bg-[#F8FAFC]" />;
  }

  if (!data.length) {
    return <div className="flex h-full items-center justify-center text-[13px] text-slate-400">No trend data available.</div>;
  }

  const maxVal = Math.max(...data.map((item) => item.value), 1);
  const minVal = Math.min(...data.map((item) => item.value), 0);
  const range = maxVal - minVal || 1;
  const width = 700;
  const height = 136;
  const padX = 20;
  const padTop = 12;
  const padBottom = 20;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padTop - padBottom;

  const points = data.map((item, index) => ({
    ...item,
    x: padX + (index / Math.max(data.length - 1, 1)) * chartWidth,
    y: padTop + chartHeight - ((item.value - minVal) / range) * chartHeight,
  }));

  const linePath = points
    .map((point, index) => {
      if (index === 0) return `M${point.x} ${point.y}`;
      const previous = points[index - 1];
      const controlX1 = previous.x + (point.x - previous.x) * 0.4;
      const controlX2 = point.x - (point.x - previous.x) * 0.4;
      return `C${controlX1} ${previous.y} ${controlX2} ${point.y} ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x} ${height - padBottom} L${points[0].x} ${height - padBottom} Z`;

  return (
    <div className="relative mt-2 h-full w-full" onMouseLeave={() => setHoveredPoint(null)}>
      {hoveredPoint !== null ? (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-200"
          style={{
            left: `${(points[hoveredPoint].x / width) * 100}%`,
            top: `${(points[hoveredPoint].y / height) * 100}%`,
            transform: "translate(-50%, -150%)",
          }}
        >
          <div className="relative whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl">
            {formatCount(points[hoveredPoint].value)} Orders
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
          </div>
        </div>
      ) : null}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 z-10 h-[calc(100%-20px)] w-full overflow-visible"
      >
        <defs>
          <linearGradient id="analyticsLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563D6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563D6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[38, 64, 90].map((y) => (
          <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
        ))}

        <path d={areaPath} fill="url(#analyticsLineGradient)" />
        <path
          d={linePath}
          fill="none"
          stroke="#2563D6"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
          style={{ filter: "drop-shadow(0px 6px 8px rgba(37, 99, 214, 0.22))" }}
        />

        {points.map((point, index) => (
          <g key={`${point.label}-${index}`} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(index)}>
            <circle cx={point.x} cy={point.y} r="25" fill="transparent" />
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === index ? "6" : "0"}
              fill="#fff"
              stroke="#2563D6"
              strokeWidth="3"
              className="transition-all duration-200 ease-out"
            />
          </g>
        ))}
      </svg>

      <div className="absolute bottom-[2px] left-0 right-0 flex justify-between px-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
        {data.map((item) => (
          <span key={item.label} className="w-10 text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
