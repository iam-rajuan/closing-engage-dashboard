import { X } from "lucide-react";
import closingEngageLogo from "../../assets/closing-engage-logo.svg";
import { navItems } from "../../data";

export function Sidebar({
  activeKey,
  onSelect,
  isOpen,
  onClose,
}: {
  activeKey: string;
  onSelect: (key: "dashboard" | "usersCompanies" | "orders" | "communications" | "documents" | "analytics" | "settings") => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[220px] border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-[68px] items-center border-b border-slate-200 px-6 justify-between lg:justify-start">
        <img src={closingEngageLogo} alt="Closing Engage" className="h-9 w-auto" />
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 lg:hidden focus:outline-none transition">
          <X size={18} />
        </button>
      </div>
      <nav className="space-y-2 px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => {
                onSelect(item.key);
                onClose();
              }}
              className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl px-4 text-left text-[15px] font-medium transition focus:outline-none ${
                isActive
                  ? "bg-[#EEF5FF] text-brand-500 shadow-[inset_0_0_0_1px_rgba(29,93,195,0.06)]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className={`h-6 w-1 rounded-full ${isActive ? "bg-brand-500" : "bg-transparent"}`} />
              <Icon size={18} strokeWidth={1.9} />
              <span className="leading-6">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
