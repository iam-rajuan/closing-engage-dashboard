import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, DropdownField, SimpleStatCard } from "../components/common";
import { DocumentTable } from "../components/tables";

export function DocumentsPage({ onOpenDocument }: { onOpenDocument: () => void }) {
  const { documents: documentRows } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status: All");

  const filteredDocuments = documentRows.filter(([fileName, orderId, , , , status]) => {
    const matchesSearch = `${fileName} ${orderId}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Status: All" ? true : status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Documents" description="Manage and access all uploaded files within the transaction pipeline." />
      <div className="grid grid-cols-[1.55fr_repeat(4,0.62fr)] gap-3">
        <label className="flex h-11 items-center gap-3 rounded-xl bg-white px-4 shadow-sm border border-slate-100 focus-within:ring-1 focus-within:ring-brand-500/20 focus-within:border-transparent transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search by file name or order ID"
          />
        </label>
        <DropdownField label="File Type: All" options={["File Type: All", "PDF", "JPG", "PNG"]} widthClass="w-full" />
        <DropdownField label="Uploaded By: All" widthClass="w-full" />
        <DropdownField
          label={statusFilter}
          options={["Status: All", "Pending Review", "Approved", "Rejected"]}
          onSelect={setStatusFilter}
          widthClass="w-full"
        />
        <DropdownField label="Date Range" icon={<Calendar size={16} className="text-slate-400" />} widthClass="w-full" />
      </div>
      <DocumentTable onOpenDocument={onOpenDocument} rows={filteredDocuments} />
      <div className="grid grid-cols-3 gap-4">
        <SimpleStatCard title="Total Files" value={documentRows.length.toLocaleString()} note="+12% this month" icon="folder" />
        <SimpleStatCard
          title="Needs Approval"
          value={documentRows.filter((d) => d[5] === "Pending Review").length.toString()}
          note="Action required"
          icon="approval"
        />
        <SimpleStatCard title="Storage Health" value="62%" note="" icon="cloud" progress={62} />
      </div>
    </div>
  );
}
