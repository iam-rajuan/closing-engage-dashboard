import { useState, useEffect } from "react";
import { Plus, Search, Download, FileText } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, PrimaryButton, DropdownField, SectionCard, IconBadge } from "../components/common";
import { OrderTable } from "../components/tables";

export function OrdersPage({
  onOpenOrder,
  onCreateOrder,
  onAssign,
  initialFilter = "All Orders",
}: {
  onOpenOrder: (id: string) => void;
  onCreateOrder: () => void;
  onAssign: (id: string) => void;
  initialFilter?: string;
}) {
  const { orders: orderRows } = useAppContext();
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const filters = ["All Orders", "Received", "Assigned", "Under Review", "Approved", "Completed"];

  const filteredRows = orderRows.filter(([id, company, , notary, location, , status]) => {
    const matchesFilter = activeFilter === "All Orders" ? true : status === activeFilter;
    const matchesStatus = statusFilter === "All Status" ? true : status === statusFilter;
    const matchesSearch = `${id} ${company} ${notary} ${location}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesStatus && matchesSearch;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const dateStrA = a[5].replace("\n", " ");
    const dateStrB = b[5].replace("\n", " ");
    const dateA = new Date(dateStrA).getTime();
    const dateB = new Date(dateStrB).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders Management"
        description="Manage and track all closing orders across your portfolio."
        action={
          <PrimaryButton onClick={onCreateOrder}>
            <Plus size={16} />
            Create Order
          </PrimaryButton>
        }
      />

      <div className="border-b border-[#E7EAF1]">
        <div className="flex gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative pb-4 text-[14px] font-semibold transition focus:outline-none ${
                activeFilter === filter ? "text-brand-500 font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {filter}
              {activeFilter === filter ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500 animate-in fade-in" /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white px-4 py-3 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex h-11 flex-1 items-center gap-3 rounded-lg bg-[#F5F8FC] px-4 text-slate-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-brand-500/20 focus-within:border-transparent transition-all">
            <Search size={15} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Filter by order ID, company, notary or city..."
            />
          </div>
          <DropdownField
            label={statusFilter}
            options={["All Status", "Received", "Assigned", "Under Review", "Approved", "Completed"]}
            onSelect={setStatusFilter}
            widthClass="w-[168px]"
          />
          <DropdownField
            label={`Sort by: ${sortOrder}`}
            options={["Newest", "Oldest"]}
            onSelect={setSortOrder}
            widthClass="w-[180px]"
          />
        </div>
      </div>

      <div className="grid max-w-[980px] grid-cols-3 gap-4">
        <SectionCard className="p-5">
          <div className="mb-7 flex items-start justify-between">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Orders</div>
            <IconBadge tone="blue">
              <FileText size={18} />
            </IconBadge>
          </div>
          <div className="text-[18px] font-bold text-slate-900">{orderRows.length}</div>
          <div className="mt-2 text-[12px] font-semibold text-[#38A868]">+12% vs last month</div>
        </SectionCard>
        <SectionCard className="p-5">
          <div className="mb-7 flex items-start justify-between">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Under Review</div>
            <IconBadge tone="amber">
              <FileText size={18} />
            </IconBadge>
          </div>
          <div className="text-[18px] font-bold text-slate-900">{orderRows.filter((o) => o[6] === "Under Review").length}</div>
          <div className="mt-2 text-[12px] font-semibold text-[#D4882F]">Awaiting action</div>
        </SectionCard>
        <SectionCard className="p-5">
          <div className="mb-7 flex items-start justify-between">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Assigned Today</div>
            <IconBadge tone="green">
              <FileText size={18} />
            </IconBadge>
          </div>
          <div className="text-[18px] font-bold text-slate-900">{orderRows.filter((o) => o[6] === "Assigned").length}</div>
          <div className="mt-2 text-[12px] font-semibold text-brand-500">Routing is on track</div>
        </SectionCard>
      </div>

      <OrderTable onOpenOrder={onOpenOrder} onAssign={onAssign} rows={sortedRows} />
    </div>
  );
}
