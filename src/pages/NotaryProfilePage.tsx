import { useAppContext } from "../context/AppContext";
import {
  PageHeader,
  GhostButton,
  PrimaryButton,
  SectionCard,
  Avatar,
  InfoBlock,
  TableHeader,
  StatusBadge,
} from "../components/common";
import { Eye, FileText, Download } from "lucide-react";
import { profileGradients, assignedOrders, uploadActivity } from "../data";
import type { StatusKey } from "../types";

export function NotaryProfilePage() {
  const { setNotaries } = useAppContext();

  const handleVerify = () => {
    setNotaries((prev: any) =>
      prev.map((n: any) =>
        n[2] === "Sarah Harrison" ? [...n.slice(0, 7), "Active", n[8]] : n
      )
    );
  };

  return (
    <div className="space-y-5">
      <div className="text-[12px] text-slate-500 font-semibold tracking-wide">
        Notaries &nbsp;›&nbsp; Notary Profile
      </div>
      <PageHeader
        title="Sarah Harrison"
        action={
          <div className="flex gap-3">
            <GhostButton className="border-[#D8E1EE]">Edit</GhostButton>
            <PrimaryButton onClick={handleVerify}>Verify Notary</PrimaryButton>
            <GhostButton className="border-transparent bg-white text-[#D14544] hover:bg-red-50/20">Actions</GhostButton>
          </div>
        }
      />
      <div className="grid grid-cols-[2fr_0.95fr] gap-5">
        <SectionCard className="p-7">
          <div className="flex items-start gap-6">
            <div className="relative overflow-hidden rounded-[22px] border border-[#D4E3FB] bg-[#E7F0FF] p-2">
              <Avatar className="h-[98px] w-[98px] rounded-[18px]" gradient={profileGradients.jane} />
              <div className="absolute bottom-2 right-2 rounded-full bg-[#EEF5FF] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-500 shadow-sm">
                Active
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-6">
              <InfoBlock label="Email Address" lines={["jane.simmons@example.com"]} strongFirst />
              <InfoBlock label="Phone Number" lines={["(555) 123-4567"]} strongFirst />
              <InfoBlock label="Notary License" lines={["#NY-88210-24"]} strongFirst />
              <InfoBlock label="Location Base" lines={["New York, NY"]} strongFirst />
            </div>
          </div>
        </SectionCard>
        <div className="rounded-2xl bg-[#2866D1] p-8 text-white shadow-[0_12px_30px_rgba(40,102,209,0.22)]">
          <h3 className="text-[18px] font-bold tracking-tight">Professional Credentials</h3>
          <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Commission Expiry</div>
          <div className="mt-2 text-[20px] font-semibold">Oct 24, 2026</div>
          <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Service Area</div>
          <div className="mt-2 max-w-[220px] text-[16px] leading-7 text-white/85">
            Greater New York Area (Manhattan, Brooklyn, Queens)
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1.65fr_1fr] gap-5">
        <SectionCard className="overflow-hidden">
          <TableHeader title="Assigned Orders" action="View All Orders" />
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedOrders.map(([id, status, date]) => (
                <tr key={id} className="border-t border-line text-[14px]">
                  <td className="px-6 py-4 font-semibold text-slate-700">{id}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={status as StatusKey} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{date}</td>
                  <td className="px-6 py-4 text-right text-brand-500">
                    <Eye size={16} className="ml-auto cursor-pointer hover:text-brand-600 transition" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
        <SectionCard className="p-6">
          <h3 className="text-[18px] font-semibold text-slate-900">Upload Activity</h3>
          <div className="mt-6 space-y-5">
            {uploadActivity.map(([title, date]) => (
              <div key={title} className="flex items-center gap-4 rounded-xl border border-line px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF3FA] text-[#D94A45]">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{title}</div>
                  <div className="text-[13px] text-slate-500">{date}</div>
                </div>
                <Download size={18} className="text-slate-500 cursor-pointer hover:text-slate-700 transition" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
