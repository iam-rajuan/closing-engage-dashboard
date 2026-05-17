import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { statusConfig } from "../../data";
import type { StatusKey } from "../../types";

// Buttons
export function PrimaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void; }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,214,0.22)] hover:bg-brand-600 transition"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-[14px] font-semibold text-slate-600 hover:bg-slate-50 transition ${className}`}
    >
      {children}
    </button>
  );
}

// Avatar
export function Avatar({ className, gradient }: { className: string; gradient: string }) {
  return <div className={`${className} overflow-hidden border border-white/50 shadow-sm ${gradient}`} />;
}

// Switch & Toggles
export function Switch({ checked }: { checked: boolean }) {
  return (
    <div className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-brand-500" : "bg-[#D9E1EE]"}`}>
      <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-6" : "left-1"}`} />
    </div>
  );
}

// Cards
export function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function IconBadge({ tone, children, large = false }: { tone: string; children: ReactNode; large?: boolean }) {
  const toneClass =
    tone === "blue"
      ? "bg-[#EEF5FF] text-brand-500"
      : tone === "green"
        ? "bg-[#EEF9F0] text-[#30A35A]"
        : tone === "amber"
          ? "bg-[#FFF1E6] text-[#D68A42]"
          : tone === "blue2"
            ? "bg-[#F2F7FF] text-[#3B82F6]"
            : "bg-[#EFF3F8] text-slate-500";
  return <div className={`flex items-center justify-center rounded-2xl ${large ? "h-14 w-14" : "h-12 w-12"} ${toneClass}`}>{children}</div>;
}

export function SimpleStatCard({
  title,
  value,
  note,
  icon,
  progress,
}: {
  title: string;
  value: string;
  note: string;
  icon: "building" | "shield" | "folder" | "approval" | "cloud";
  progress?: number;
}) {
  const tone = icon === "approval" ? "amber" : icon === "shield" ? "green" : "blue";
  return (
    <SectionCard className="p-5">
      <div className="mb-7 flex items-start justify-between">
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div>
        <IconBadge tone={tone}><FileText size={18} /></IconBadge>
      </div>
      <div className="text-[18px] font-bold">{value}</div>
      {progress ? (
        <div className="mt-4 h-1.5 w-20 rounded-full bg-[#E5EAF2]">
          <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <div className={`mt-2 text-[12px] font-semibold ${note.includes("+") ? "text-[#38A868]" : "text-brand-500"}`}>{note}</div>
      )}
    </SectionCard>
  );
}

export function MetricPanel({
  title,
  value,
  note,
  tone = "slate",
  icon: Icon,
  compact = false,
}: {
  title: string;
  value: string;
  note?: string;
  tone?: "blue" | "green" | "amber" | "slate";
  icon: typeof FileText;
  compact?: boolean;
}) {
  return (
    <SectionCard className={`metric-card-hover ${compact ? "min-h-[104px] p-4" : "min-h-[142px] p-5"}`}>
      <div className="mb-4 flex items-start justify-between">
        <IconBadge tone={tone}><Icon size={compact ? 16 : 18} /></IconBadge>
        {note ? (
          note === "Alert" ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#FFF4E8] px-2.5 py-1 text-[10px] font-semibold text-[#D4882F]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#D4882F]" />
              {note}
            </span>
          ) : (
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tone === "amber" ? "text-[#D4882F]" : tone === "green" ? "text-[#2F9E54]" : "text-[#44B887]"}`}>{note}</span>
          )
        ) : null}
      </div>
      <div className={`font-medium leading-5 text-slate-500 ${compact ? "text-[11px] uppercase tracking-[0.12em]" : "text-[15px]"}`}>{title}</div>
      <div className={`mt-2 font-bold text-slate-900 ${compact ? "text-[16px]" : "text-[18px]"}`}>{value}</div>
    </SectionCard>
  );
}

export function SmallMetricCard({ title, value, tone }: { title: string; value: string; tone: "blue" | "blue2" | "green"; }) {
  return (
    <SectionCard className="flex items-center gap-4 p-5">
      <IconBadge tone={tone}><FileText size={18} /></IconBadge>
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div>
        <div className={`mt-1 text-[18px] font-bold ${tone === "green" ? "text-[#2E9F54]" : tone === "blue2" ? "text-[#2381FF]" : "text-slate-900"}`}>{value}</div>
      </div>
    </SectionCard>
  );
}

export function SnapshotItem({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3 border border-slate-100">
      <div className="text-slate-400">{icon}</div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</div>
        <div className="text-[14px] font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
}

export function StatusTile({ label, value, tone }: { label: string; value: string; tone: "blue" | "green" | "amber" }) {
  const bg = tone === "blue" ? "bg-[#eef4ff] text-[#1e40af]" : tone === "green" ? "bg-[#ecfdf5] text-[#065f46]" : "bg-[#fffbeb] text-[#92400e]";
  return (
    <div className={`rounded-2xl px-4 py-3 ${bg}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-80">{label}</div>
      <div className="mt-1 text-[15px] font-bold">{value}</div>
    </div>
  );
}

// Table Helpers
export function StatusBadge({ status }: { status: StatusKey }) {
  return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusConfig[status]}`}>{status}</span>;
}

export function TableHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <h3 className="text-[18px] font-semibold text-slate-800">{title}</h3>
      <button className="text-[13px] font-semibold text-brand-500 hover:text-brand-600 transition">{action}</button>
    </div>
  );
}

export function Pagination({
  footer,
  pages,
  withPrevious = false,
}: {
  footer: string;
  pages: string[];
  withPrevious?: boolean;
}) {
  return (
    <div className="flex items-center justify-between bg-[#EEF3FA] px-4 py-3 text-[13px] text-slate-500">
      <div>{footer}</div>
      <div className="flex items-center gap-2">
        {withPrevious ? (
          <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
            <ChevronLeft size={14} /> Previous
          </button>
        ) : (
          <ChevronLeft size={14} className="text-slate-400" />
        )}
        {pages.map((p, index) => (
          <button
            key={`${p}-${index}`}
            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] transition ${
              index === 0 ? "bg-brand-500 text-white font-semibold" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p}
          </button>
        ))}
        {withPrevious ? (
          <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800">
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <ChevronRight size={14} className="text-slate-500" />
        )}
      </div>
    </div>
  );
}

// Form Helpers
export function SettingsInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500/10"
      />
    </label>
  );
}

export function SettingsToggle({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <div className="text-[14px] font-semibold text-slate-800">{label}</div>
        <div className="mt-0.5 text-[12px] text-slate-400 leading-normal">{description}</div>
      </div>
      <button type="button" onClick={onToggle} className="focus:outline-none">
        <Switch checked={checked} />
      </button>
    </div>
  );
}

export function PreferencePill({ label, active }: { label: string; active: boolean }) {
  const classes = active ? "bg-[#eef5ff] border-brand-200 text-brand-600 font-semibold" : "bg-white border-slate-200 text-slate-600";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] transition ${classes}`}>{label}</span>;
}

export function UsersTabs({
  active,
  onCompanies,
  onNotaries,
  companyCount,
  notaryCount,
}: {
  active: "companies" | "notaries";
  onCompanies: () => void;
  onNotaries: () => void;
  companyCount: string;
  notaryCount: string;
}) {
  return (
    <div className="border-b border-[#E7EAF1]">
      <div className="flex gap-8">
        <button
          onClick={onCompanies}
          className={`relative pb-4 text-[14px] font-semibold transition ${active === "companies" ? "text-brand-500" : "text-slate-500 hover:text-slate-700"}`}
        >
          Title Companies{" "}
          <span className="ml-2 rounded-full bg-[#EEF3FA] px-2 py-0.5 text-[10px] text-slate-500">
            {companyCount}
          </span>
          {active === "companies" ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" /> : null}
        </button>
        <button
          onClick={onNotaries}
          className={`relative pb-4 text-[14px] font-semibold transition ${active === "notaries" ? "text-brand-500" : "text-slate-500 hover:text-slate-700"}`}
        >
          Notaries{" "}
          <span className="ml-2 rounded-full bg-[#EEF3FA] px-2 py-0.5 text-[10px] text-slate-500">
            {notaryCount}
          </span>
          {active === "notaries" ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" /> : null}
        </button>
      </div>
    </div>
  );
}

export function DropdownField({
  label,
  options = [],
  onSelect = () => {},
  icon,
}: {
  label: string;
  options?: string[];
  onSelect?: (val: string) => void;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 min-w-[140px] items-center justify-between gap-3 rounded-[12px] border border-[#e2e8f3] bg-white px-4 text-[14px] font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-slate-50"
      >
        <span className="flex items-center gap-2">{icon}{label}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 min-w-full overflow-hidden rounded-[14px] border border-[#e2e8f3] bg-white py-1 shadow-[0_12px_40px_rgba(20,48,112,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-[14px] transition-colors hover:bg-brand-50 ${
                label === opt ? "bg-brand-50 font-bold text-brand-600" : "text-slate-600 hover:text-brand-600"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  searchValue = "",
  onSearchChange = () => {},
  statusValue = "All Status",
  onStatusChange = () => {},
  statusOptions = ["All Status"],
}: {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  statusValue?: string;
  onStatusChange?: (val: string) => void;
  statusOptions?: string[];
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm">
      <div className="flex h-11 flex-1 items-center gap-3 rounded-lg bg-[#F5F8FC] px-4 text-slate-400">
        <Search size={15} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by name, ID or city..."
          className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <DropdownField label={statusValue} options={statusOptions} onSelect={onStatusChange} />
      <DropdownField label="Sort by: Newest" />
      <Download
        size={16}
        className="cursor-pointer text-slate-500 hover:text-brand-500 transition"
        onClick={() => alert("Exporting report...")}
      />
    </div>
  );
}

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-11 items-center gap-3 rounded-xl border border-line bg-white px-4">
      <Search size={16} className="text-slate-400" />
      <span className="text-[14px] text-slate-400">{placeholder}</span>
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SectionCard className="overflow-hidden">
      <div className="border-b border-line px-4 py-3.5 text-[18px] font-semibold text-slate-800 bg-slate-50/30">{title}</div>
      <div className="p-4">{children}</div>
    </SectionCard>
  );
}

export function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className="input-base flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[14px] text-slate-700">{value}</div>
    </div>
  );
}

export function NotificationRow({
  title,
  text,
  checked,
  onToggle,
}: {
  title: string;
  text: string;
  checked: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[14px] font-semibold text-slate-855">{title}</div>
        <div className="text-[12px] text-slate-500 leading-normal">{text}</div>
      </div>
      <button type="button" onClick={onToggle} className="focus:outline-none">
        <Switch checked={checked} />
      </button>
    </div>
  );
}

export function ToggleCard({
  title,
  subtitle,
  checked,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#F6F8FC] px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[16px] font-semibold text-slate-700">{title}</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{subtitle}</div>
        </div>
        <Switch checked={checked} />
      </div>
    </div>
  );
}

// Placeholders
export function ChartPlaceholder() {
  const bars = [60, 92, 78, 132, 174, 142, 110, 98, 104];
  return (
    <div className="relative h-[240px] rounded-xl bg-white">
      <div className="absolute left-[44%] top-[10%] rounded bg-[#3A3E43] px-3 py-1 text-[11px] text-white">Peak: 1,240</div>
      <svg viewBox="0 0 620 230" className="absolute inset-0 h-full w-full">
        <path
          d="M20,140 C90,120 120,118 170,124 C220,130 260,116 300,92 C346,64 400,28 470,50 C530,70 540,130 600,122"
          fill="none"
          stroke="#1D5DC3"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute bottom-10 left-0 right-0 flex items-end justify-between gap-3 px-6">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-md ${index === 4 ? "bg-[#1657C0]" : "bg-[#C9DBF7]"}`}
            style={{ height: `${bar}px` }}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </div>
  );
}

export function BarPlaceholder() {
  const bars = [75, 120, 98, 142, 110, 58, 66];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="h-[188px]">
      <div className="flex h-[164px] items-end justify-between gap-3">
        {bars.map((bar, index) => (
          <div key={labels[index]} className="flex flex-1 flex-col items-center justify-end gap-3">
            <div className={`w-full rounded-t-[18px] transition-all ${index === 2 ? "bg-brand-500" : "bg-[#EEF3FA]"}`} style={{ height: `${bar}px` }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LinePlaceholder() {
  return (
    <div className="relative h-[188px] overflow-hidden">
      <svg viewBox="0 0 700 186" className="absolute inset-x-0 top-2 h-[150px] w-full">
        <path
          d="M40 134 C108 124 150 60 220 60 C290 60 330 110 398 112 C470 114 510 10 584 14 C628 16 654 48 676 72 L676 186 L40 186 Z"
          fill="#D9E7FD"
        />
        <path
          d="M40 134 C108 124 150 60 220 60 C290 60 330 110 398 112 C470 114 510 10 584 14 C628 16 654 48 676 72"
          fill="none"
          stroke="#1D5DC3"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </div>
  );
}

export function FilePreview() {
  return (
    <div className="mx-auto aspect-[0.75] w-[325px] rounded-sm bg-white px-8 py-7 shadow-[0_20px_40px_rgba(30,41,59,0.18)]">
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-bold uppercase">Closing Disclosure</div>
        <div className="text-right text-[6px] text-slate-400">
          <div>OMB No. 3170-0015</div>
          <div>Expires 01/31/2024</div>
        </div>
      </div>
      <div className="mt-2 h-px bg-slate-600" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-3 rounded bg-[#EFF3FA]" />
        <div className="h-3 rounded bg-[#EFF3FA]" />
      </div>
      <div className="mt-5 flex h-[74px] items-center justify-center rounded border border-dashed border-[#D8E1ED] bg-[#F9FBFE] text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-300">
        Document Content Placeholder
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-3 rounded bg-[#EFF3FA]" />
        <div className="h-3 w-11/12 rounded bg-[#EFF3FA]" />
        <div className="h-3 w-10/12 rounded bg-[#EFF3FA]" />
      </div>
      <div className="mt-24 flex justify-between">
        <div className="h-6 w-[70px] rounded bg-[#F5F7FB]" />
        <div className="h-6 w-[70px] rounded bg-[#F5F7FB]" />
      </div>
    </div>
  );
}

// Misc Visual Elements
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[24px] font-bold leading-none text-slate-900">{title}</h1>
        {description ? <p className="mt-2 text-[14px] text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function InfoBlock({
  label,
  lines,
  strongFirst = false,
  icons = [],
}: {
  label: string;
  lines: string[];
  strongFirst?: boolean;
  icons?: Array<any>;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</div>
      {lines.map((line, index) => {
        const Icon = icons[index] ?? icons[0];
        return (
          <div key={`${label}-${line}-${index}`} className={`flex items-center gap-2 ${index > 0 ? "mt-1" : ""}`}>
            {Icon ? <Icon size={14} className="text-brand-500" /> : null}
            <div className={`${strongFirst && index === 0 ? "font-semibold text-slate-800" : "text-slate-600"}`}>{line}</div>
          </div>
        );
      })}
    </div>
  );
}

export function ActivityLog({
  title,
  items,
  footer,
}: {
  title: string;
  items: Array<{ title: string; date: string; tone: string }>;
  footer: string;
}) {
  return (
    <SectionCard className="p-4">
      <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div>
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={item.title} className="relative flex gap-4">
            <div className="relative mt-1 flex flex-col items-center">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  item.tone === "green"
                    ? "bg-[#DCF9E5] text-[#2E9F54]"
                    : item.tone === "blue"
                      ? "bg-[#EEF5FF] text-brand-500"
                      : "bg-[#EFF3FA] text-slate-400"
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              {index < items.length - 1 ? <div className="mt-2 h-10 w-px bg-[#E7ECF4]" /> : null}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-slate-700">{item.title}</div>
              <div className="text-[12px] text-slate-400">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500 hover:text-brand-500 transition">{footer}</button>
    </SectionCard>
  );
}

export function StepProgress({ current, stepItems }: { current: number; stepItems: string[] }) {
  return (
    <div className="flex items-center justify-between">
      {stepItems.map((item, index) => {
        const completed = index < current;
        const isCurrent = index === current;
        const upcoming = index > current;

        return (
          <div key={item} className="relative flex flex-1 flex-col items-center">
            {index < stepItems.length - 1 ? (
              <div className={`absolute left-1/2 top-5 h-[2px] w-full ${completed ? "bg-brand-500" : "bg-[#E3E8F1]"}`} />
            ) : null}
            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                isCurrent
                  ? "border-brand-500 bg-white text-brand-500 shadow-[0_0_0_4px_rgba(29,93,195,0.08)]"
                  : completed
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-[#D8E1EE] bg-[#F6F8FC] text-slate-400"
              }`}
            >
              {isCurrent ? <Eye size={16} /> : completed ? <Check size={14} /> : <Circle size={12} fill="currentColor" />}
            </div>
            <div
              className={`mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] ${
                isCurrent ? "text-brand-500" : upcoming ? "text-slate-400" : "text-slate-700"
              }`}
            >
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function KeyValue({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="space-y-4 text-[14px]">
      {rows.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-slate-500">{key}</span>
          <span className="font-semibold text-slate-800">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function MetricStrip({ title, value, dot = false }: { title: string; value: string; dot?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</div>
      <div className="mt-1 flex items-center gap-2 text-[18px] font-bold">
        {value}
        {dot ? <span className="h-2.5 w-2.5 rounded-full border border-brand-500" /> : null}
      </div>
    </div>
  );
}
