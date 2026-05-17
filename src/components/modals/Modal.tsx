import type { ReactNode } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { Switch } from "../common";

export function Modal({
  children,
  onClose,
  widthClass,
}: {
  children: ReactNode;
  onClose: () => void;
  widthClass: string;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-5 py-5 backdrop-blur-[2px] transition-all duration-300"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[24px] border border-[#dfe6f2] bg-white shadow-[0_30px_70px_rgba(15,23,42,0.22)] animate-in zoom-in-95 duration-200 ${widthClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between px-6 py-5 border-b border-[#edf1f7]">
      <div>
        <h2 className="text-[18px] font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
      </div>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ModalFooter({ onClose, confirmLabel }: { onClose: () => void; confirmLabel: string }) {
  return (
    <div className="flex items-center justify-end gap-5 rounded-b-[28px] bg-[#EEF3FA] px-5 py-4">
      <button onClick={onClose} className="text-[16px] font-semibold text-slate-600">
        Cancel
      </button>
      <button className="rounded-lg bg-brand-500 px-8 py-3 text-[15px] font-semibold text-white">
        {confirmLabel}
      </button>
    </div>
  );
}

export function ModalActionFooter({
  onClose,
  onConfirm,
  confirmLabel,
}: {
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-[#edf1f7] bg-[#fbfcff] px-7 py-5">
      <button
        onClick={onClose}
        className="h-[46px] rounded-[12px] border border-[#dfe6f2] bg-white px-6 text-[15px] font-semibold text-ink-700 transition hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="h-[46px] rounded-[12px] bg-brand-500 px-8 text-[15px] font-semibold text-white shadow-[0_14px_32px_rgba(29,93,195,0.22)] transition hover:bg-brand-600 hover:-translate-y-0.5"
      >
        {confirmLabel}
      </button>
    </div>
  );
}

export function ModalInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[13px] font-semibold text-slate-600">{label}</div>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-[#E1E7F0] bg-[#F5F8FC] px-4">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}

export function ModalCheckbox({
  checked,
  onToggle,
  label,
  className = "",
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 text-[14px] font-medium text-slate-600 ${className}`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded border transition ${
          checked ? "border-brand-500 bg-brand-500 text-white" : "border-[#D5DDE9] bg-white text-transparent"
        }`}
      >
        <Check size={13} strokeWidth={3} />
      </span>
      {label}
    </button>
  );
}

export function SegmentedToggle({
  left,
  right,
  active,
  onChange,
}: {
  left: string;
  right: string;
  active: "left" | "right";
  onChange: (value: "left" | "right") => void;
}) {
  return (
    <div className="flex rounded-full bg-[#E9EEF6] p-1">
      <button
        onClick={() => onChange("left")}
        className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
          active === "left" ? "bg-white text-brand-500 shadow-sm" : "text-slate-500"
        }`}
      >
        {left}
      </button>
      <button
        onClick={() => onChange("right")}
        className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
          active === "right" ? "bg-white text-brand-500 shadow-sm" : "text-slate-500"
        }`}
      >
        {right}
      </button>
    </div>
  );
}

export function ToggleOptionCard({
  title,
  subtitle,
  checked,
  onToggle,
  icon,
  activeColor = "text-brand-500",
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
  icon: ReactNode;
  activeColor?: string;
}) {
  return (
    <div className={`rounded-xl px-5 py-4 border transition-all duration-200 ${checked ? "bg-white border-slate-200 shadow-sm" : "bg-[#F5F8FC] border-transparent"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`transition-colors duration-200 ${checked ? "text-brand-500" : "text-slate-400"}`}>{icon}</div>
          <div>
            <div className="text-[14px] font-bold text-slate-800">{title}</div>
            <div className={`text-[10px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 ${checked ? activeColor : "text-slate-400"}`}>
              {subtitle}
            </div>
          </div>
        </div>
        <button type="button" onClick={onToggle} className="focus:outline-none">
          <Switch checked={checked} />
        </button>
      </div>
    </div>
  );
}

export function InputField({ label, placeholder, icon }: { label: string; placeholder: string; icon?: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[14px] font-semibold text-slate-600">{label}</div>
      <div className="input-base flex items-center gap-3 border border-slate-100 rounded-xl px-4 py-3 text-[14px]">
        {icon}
        <span className="text-slate-400">{placeholder}</span>
      </div>
    </div>
  );
}

export function ToggleGroup({ left, right, active }: { left: string; right: string; active: "left" | "right" }) {
  return (
    <div className="flex rounded-full bg-[#E9EEF6] p-1">
      <button
        className={`rounded-full px-5 py-2 text-[13px] font-semibold ${
          active === "left" ? "bg-white text-brand-500 shadow-sm" : "text-slate-500"
        }`}
      >
        {left}
      </button>
      <button
        className={`rounded-full px-5 py-2 text-[13px] font-semibold ${
          active === "right" ? "bg-white text-brand-500 shadow-sm" : "text-slate-500"
        }`}
      >
        {right}
      </button>
    </div>
  );
}

export function ModalSectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 text-[16px] font-semibold uppercase tracking-[0.12em] text-brand-500">
      <ShieldCheck size={16} />
      {title}
    </div>
  );
}
