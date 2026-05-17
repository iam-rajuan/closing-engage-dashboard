import { MoreVertical, FileText, Download } from "lucide-react";
import { analyticsMetrics } from "../data";
import {
  MetricPanel,
  SectionCard,
  BarPlaceholder,
  LinePlaceholder,
  TableHeader,
  PrimaryButton,
  MetricStrip,
} from "../components/common";

export function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold leading-none text-slate-900">Analytics</h1>
          <p className="mt-2 text-[14px] text-slate-500">Track system performance and insights</p>
        </div>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          {["Today", "Last 7 days", "Last 30 days", "Custom range"].map((label, index) => (
            <button
              key={label}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-colors focus:outline-none ${
                index === 2 ? "bg-[#EEF5FF] text-brand-500 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {analyticsMetrics.map((metric) => (
          <MetricPanel key={metric.title} {...metric} compact />
        ))}
      </div>

      <div className="grid grid-cols-[1.04fr_1fr] gap-4">
        <SectionCard className="min-h-[318px] p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Orders by Status</h3>
              <p className="mt-1 text-[13px] text-slate-500">Weekly status distribution across the pipeline</p>
            </div>
            <button className="rounded-md p-1 text-slate-400 transition-colors hover:bg-[#F5F8FD] hover:text-slate-600 focus:outline-none">
              <MoreVertical size={16} />
            </button>
          </div>
          <BarPlaceholder />
        </SectionCard>

        <SectionCard className="min-h-[318px] p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Orders Trend</h3>
              <p className="mt-1 text-[13px] text-slate-500">Rolling completion and review movement over time</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-505">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Last 30 Days
            </div>
          </div>
          <LinePlaceholder />
        </SectionCard>
      </div>

      <div className="grid grid-cols-[1.08fr_1fr] gap-4">
        <SectionCard className="overflow-hidden">
          <TableHeader title="Notary Performance" action="View All" />
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="px-5 py-4 text-left">Name</th>
                <th className="px-5 py-4 text-left">Completed</th>
                <th className="px-5 py-4 text-left">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["SC", "Sarah Connor", "142", "98.5%"],
                ["MK", "Michael K.", "128", "96.2%"],
                ["RW", "Rebecca White", "94", "94.8%"],
              ].map(([initials, name, completed, rate], index) => (
                <tr key={name} className="border-t border-line text-[14px]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                          index === 0 ? "bg-[#DCE7FF] text-[#3165CF]" : "bg-[#EEF3FA] text-slate-500"
                        }`}
                      >
                        {initials}
                      </div>
                      <span className="font-semibold text-slate-800">{name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">{completed}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#E3EEFF] px-3 py-1 text-[12px] font-bold text-brand-500">{rate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
        <SectionCard className="overflow-hidden">
          <TableHeader title="Title Company Activity" action="Full List" />
          <div className="divide-y divide-line">
            {[
              ["First American Title", "Enterprise Client", "412", "Orders"],
              ["Old Republic Title", "Active Partner", "389", "Orders"],
              ["Stewart Title", "Regional Lead", "276", "Orders"],
            ].map(([name, sub, value, label]) => (
              <div key={name} className="flex items-center justify-between px-5 py-5 bg-white">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#EEF3FA] p-3 text-slate-500">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{name}</div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">{sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-bold leading-none text-slate-800">{value}</div>
                  <div className="mt-1 text-[12px] text-slate-400 font-semibold">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="flex items-center justify-between px-6 py-6">
        <div>
          <h3 className="text-[16px] font-bold text-slate-900">File Upload Performance</h3>
          <p className="mt-2 max-w-[520px] text-[14px] leading-6 text-slate-505 font-medium">
            Comprehensive tracking of system-wide document processing and automated compliance checks.
          </p>
        </div>
        <div className="flex items-center gap-10">
          <MetricStrip title="Total Uploads" value="12.4k" />
          <MetricStrip title="Pending Approval" value="1.2k" />
          <MetricStrip title="Approval Rate" value="94.2%" dot />
          <PrimaryButton>
            <Download size={15} />
            Export Report
          </PrimaryButton>
        </div>
      </SectionCard>
    </div>
  );
}
