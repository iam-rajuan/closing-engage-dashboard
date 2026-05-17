import { useState } from "react";
import { MoreVertical, FileText, ClipboardList, CheckCircle2, FolderOpen, UserCog, Building2 } from "lucide-react";
import {
  SectionCard,
  MetricPanel,
  BarPlaceholder,
  LinePlaceholder,
  TableHeader,
} from "../components/common";
import { useToast } from "../components/Toast";
import type { PageKey } from "../types";

export function AnalyticsPage({ onNavigate }: { onNavigate?: (page: PageKey) => void }) {
  const [activeRange, setActiveRange] = useState("Last 30 days");
  const { showToast } = useToast();

  const getMetricsData = () => {
    switch (activeRange) {
      case "Today":
        return [
          { title: "Total Orders", value: "82", note: "+2%", tone: "blue" as const, icon: ClipboardList },
          { title: "Completed", value: "61", tone: "blue" as const, icon: CheckCircle2 },
          { title: "Pending Orders", value: "21", tone: "amber" as const, icon: FolderOpen },
          { title: "Active Notaries", value: "45", tone: "slate" as const, icon: UserCog },
          { title: "Title Companies", value: "18", tone: "slate" as const, icon: Building2 },
        ];
      case "Last 7 days":
        return [
          { title: "Total Orders", value: "582", note: "+8%", tone: "blue" as const, icon: ClipboardList },
          { title: "Completed", value: "432", tone: "blue" as const, icon: CheckCircle2 },
          { title: "Pending Orders", value: "150", tone: "amber" as const, icon: FolderOpen },
          { title: "Active Notaries", value: "98", tone: "slate" as const, icon: UserCog },
          { title: "Title Companies", value: "52", tone: "slate" as const, icon: Building2 },
        ];
      case "Custom range":
        return [
          { title: "Total Orders", value: "5,190", note: "+15%", tone: "blue" as const, icon: ClipboardList },
          { title: "Completed", value: "3,982", tone: "blue" as const, icon: CheckCircle2 },
          { title: "Pending Orders", value: "1,208", tone: "amber" as const, icon: FolderOpen },
          { title: "Active Notaries", value: "240", tone: "slate" as const, icon: UserCog },
          { title: "Title Companies", value: "118", tone: "slate" as const, icon: Building2 },
        ];
      case "Last 30 days":
      default:
        return [
          { title: "Total Orders", value: "2,482", note: "+12%", tone: "blue" as const, icon: ClipboardList },
          { title: "Completed", value: "1,845", tone: "blue" as const, icon: CheckCircle2 },
          { title: "Pending Orders", value: "485", tone: "amber" as const, icon: FolderOpen },
          { title: "Active Notaries", value: "124", tone: "slate" as const, icon: UserCog },
          { title: "Title Companies", value: "86", tone: "slate" as const, icon: Building2 },
        ];
    }
  };

  const activeMetrics = getMetricsData();

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[22px] font-bold leading-none text-slate-900">Analytics</h1>
          <p className="mt-1.5 text-[13px] text-slate-500">Track system performance and insights</p>
        </div>
        <div className="flex gap-1 rounded-full border border-[#E2E8F0] bg-white p-1 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          {["Today", "Last 7 days", "Last 30 days", "Custom range"].map((label) => (
            <button
              key={label}
              onClick={() => {
                setActiveRange(label);
                showToast(`Filter Applied`, { message: `Analytics view set to ${label}.`, variant: "success" });
              }}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all focus:outline-none ${
                activeRange === label
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metric Cards — 5 equal-width individual cards ── */}
      <div className="grid grid-cols-5 gap-4 flex-shrink-0">
        {activeMetrics.map((metric) => (
          <MetricPanel key={`${activeRange}-${metric.title}`} {...metric} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <SectionCard className="p-4 flex flex-col overflow-hidden">
          <div className="flex items-start justify-between flex-shrink-0">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Orders by Status</h3>
              <p className="mt-0.5 text-[12px] text-slate-500">Weekly status distribution across the pipeline</p>
            </div>
            <button className="rounded-md p-1 text-slate-400 transition-colors hover:bg-[#F5F8FD] hover:text-slate-600 focus:outline-none">
              <MoreVertical size={15} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <BarPlaceholder key={activeRange} />
          </div>
        </SectionCard>

        <SectionCard className="p-4 flex flex-col overflow-hidden">
          <div className="flex items-start justify-between flex-shrink-0">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Orders Trend</h3>
              <p className="mt-0.5 text-[12px] text-slate-500">Rolling completion and review movement over time</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              {activeRange}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <LinePlaceholder key={activeRange} />
          </div>
        </SectionCard>
      </div>

      {/* ── Bottom Tables Row ── */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <SectionCard className="overflow-hidden flex flex-col">
          <TableHeader
            title="Notary Performance"
            action="View All"
            onAction={() => onNavigate?.("usersNotaries")}
          />
          <table className="w-full flex-1">
            <thead className="table-head">
              <tr>
                <th className="px-5 py-2 text-left">Name</th>
                <th className="px-5 py-2 text-left">Completed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["SC", "Sarah Connor", "142"],
                ["MK", "Michael K.", "128"],
                ["RW", "Rebecca White", "94"],
              ].map(([initials, name, completed], index) => (
                <tr key={name} className="border-t border-line text-[14px]">
                  <td className="px-5 py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                          index === 0 ? "bg-[#DCE7FF] text-[#3165CF]" : "bg-[#EEF3FA] text-slate-500"
                        }`}
                      >
                        {initials}
                      </div>
                      <span className="font-semibold text-slate-800">{name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2 text-slate-700 font-medium">{completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard className="overflow-hidden flex flex-col">
          <TableHeader
            title="Title Company Activity"
            action="Full List"
            onAction={() => onNavigate?.("usersCompanies")}
          />
          <div className="divide-y divide-line flex-1">
            {[
              ["First American Title", "Enterprise Client", "412", "Orders"],
              ["Old Republic Title", "Active Partner", "389", "Orders"],
              ["Stewart Title", "Regional Lead", "276", "Orders"],
            ].map(([name, sub, value, label]) => (
              <div key={name} className="flex items-center justify-between px-5 py-2.5 bg-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#EEF3FA] p-2 text-slate-500">
                    <FileText size={15} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-slate-800">{name}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-bold leading-none text-slate-800">{value}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400 font-semibold">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
