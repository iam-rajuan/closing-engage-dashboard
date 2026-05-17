import { useState } from "react";
import { Search, X, ShieldCheck } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { assignableNotaries } from "../../data";
import { StatusBadge } from "../common";
import type { StatusKey } from "../../types";

export function AssignNotaryModal({ orderId, onClose }: { orderId: string | null; onClose: () => void }) {
  const { orders, setOrders } = useAppContext();
  const [query, setQuery] = useState("");
  
  const order = orders.find((o: any) => o[0] === orderId) || orders[0];
  const orderNum = order ? order[0] : "#ORD-90212";
  const orderLocation = order ? order[4].replace("\n", ", ") : "123 Maple St, Austin, TX";

  const [selectedNotary, setSelectedNotary] = useState<string>(
    order && order[3] !== "Unassigned" ? order[3] : "Sarah Jenkins"
  );
  
  const visibleNotaries = assignableNotaries.filter(([name, meta]) =>
    `${name} ${meta}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleAssign = () => {
    if (!orderId) {
      onClose();
      return;
    }
    setOrders((prev: any) =>
      prev.map((o: any) =>
        o[0] === orderId
          ? [o[0], o[1], o[2], selectedNotary, o[4], o[5], "Assigned", selectedNotary.toLowerCase().includes("sarah") || selectedNotary.toLowerCase().includes("elena") ? "jane" : "mark"]
          : o
      )
    );
    onClose();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-slate-900">Assign Notary</h2>
          <p className="text-[15px] text-slate-500">Select a notary for this order</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition">
          <X size={30} strokeWidth={1.5} />
        </button>
      </div>
      <div className="rounded-2xl bg-[#EEF3FA] p-5">
        <div className="grid grid-cols-[130px_1fr] gap-y-4 text-[16px]">
          <div className="font-semibold uppercase tracking-[0.08em] text-slate-500">Order ID</div>
          <div className="text-right font-semibold text-slate-800">{orderNum}</div>
          <div className="font-semibold uppercase tracking-[0.08em] text-slate-500">Location</div>
          <div className="text-right font-semibold text-slate-800">{orderLocation}</div>
        </div>
      </div>
      <div className="mt-7">
        <label className="flex h-11 items-center gap-3 rounded-xl bg-[#EEF3FA] px-4 text-slate-400">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or location..."
            className="w-full border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>
      <div className="mt-8 space-y-10">
        {visibleNotaries.map(([name, meta, status]) => {
          const isSelected = selectedNotary === name;
          return (
            <button
              key={name}
              onClick={() => setSelectedNotary(name)}
              className="flex w-full items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-start gap-5">
                <span
                  className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                    isSelected ? "border-brand-500" : "border-[#D4DAE5]"
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full transition-all ${isSelected ? "bg-brand-500" : "bg-transparent"}`} />
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[20px] font-semibold text-slate-800">{name}</span>
                    <StatusBadge status={status as StatusKey} />
                  </div>
                  <div className="mt-1 text-[16px] text-slate-500">{meta}</div>
                </div>
              </div>
              <div className="rounded-full p-2 text-brand-500">
                <ShieldCheck size={18} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4">
        <button
          onClick={handleAssign}
          className="rounded-xl bg-brand-500 py-4 text-[16px] font-semibold text-white shadow-md hover:bg-brand-600 transition"
        >
          Assign Notary
        </button>
        <button
          onClick={onClose}
          className="rounded-xl bg-[#E8EDF6] py-4 text-[16px] font-semibold text-slate-600 hover:bg-slate-200 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
