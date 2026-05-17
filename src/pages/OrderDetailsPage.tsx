import { useMemo } from "react";
import { ArrowLeft, Link2, Calendar, MapPin, FileText, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import {
  StatusBadge,
  GhostButton,
  PrimaryButton,
  SectionCard,
  StepProgress,
  InfoBlock,
  ActivityLog,
} from "../components/common";
import { orderTimeline, stepItems } from "../data";
import type { StatusKey } from "../types";

export function OrderDetailsPage({
  orderId,
  onBack,
  onAssign,
}: {
  orderId: string | null;
  onBack: () => void;
  onAssign: () => void;
}) {
  const { orders } = useAppContext();

  // Dynamically load the matching order or fallback to the first active order
  const activeOrder = useMemo(() => {
    if (!orderId) return orders[0] || ["#ORD-78241", "Grand Peak Title", "GP", "Sarah Harrison", "San Francisco, CA", "Oct 24, 2024", "Under Review", "jane"];
    return orders.find((o) => o[0] === orderId) || orders[0];
  }, [orders, orderId]);

  const [id, company, , notaryName, location, date, status, avatar] = activeOrder;

  // Dynamically determine the timeline progress index based on status
  const currentStep = useMemo(() => {
    if (status === "Completed") return 4;
    if (status === "Approved") return 3;
    if (status === "Under Review") return 2;
    if (status === "Assigned") return 1;
    return 0; // Received
  }, [status]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 rounded-full border border-line bg-white p-2 text-brand-500 hover:bg-slate-50 transition focus:outline-none"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[18px] font-bold text-slate-900">{id}</h1>
              <StatusBadge status={status as StatusKey} />
            </div>
            <div className="mt-1 text-[14px] text-slate-500 font-medium">Order created on {date}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <GhostButton className="w-[140px] h-[46px] justify-center border-brand-300 text-brand-600 bg-brand-50/50 hover:bg-brand-50 px-0 rounded-lg text-sm font-semibold">
            Change Status
          </GhostButton>
          <PrimaryButton
            onClick={onAssign}
            className="w-[140px] h-[46px] justify-center px-0 rounded-lg text-sm font-semibold"
          >
            Assign Notary
          </PrimaryButton>
        </div>
      </div>

      <SectionCard className="p-6">
        <StepProgress current={currentStep} stepItems={[...stepItems]} />
      </SectionCard>

      <div className="grid grid-cols-[1.65fr_0.95fr] gap-5">
        <div className="space-y-5">
          <SectionCard className="overflow-hidden">
            <div className="table-head flex items-center justify-between px-5 py-4 bg-slate-50/40 border-b border-line">
              <span className="font-semibold text-slate-700">Order Information</span>
              <Link2 size={14} className="text-brand-500" />
            </div>
            <div className="grid grid-cols-2 gap-6 p-5">
              <InfoBlock label="Title Company" lines={[company]} strongFirst />
              <InfoBlock label="Signing Date & Time" lines={[date]} strongFirst icons={[Calendar]} />
              <div className="col-span-2">
                <InfoBlock label="Property Address" lines={[location]} strongFirst icons={[MapPin]} />
              </div>
            </div>
          </SectionCard>

          <SectionCard className="overflow-hidden">
            <div className="table-head flex items-center justify-between px-5 py-4 bg-slate-50/40 border-b border-line">
              <span className="font-semibold text-slate-700">Signing Agent Details</span>
              <User size={14} className="text-brand-500" />
            </div>
            <div className="p-5">
              {avatar === "none" ? (
                <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-[14px] text-slate-500 font-medium">No notary assigned to this order yet.</p>
                  <button
                    onClick={onAssign}
                    className="mt-2 text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition"
                  >
                    + Assign a Professional Notary Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <InfoBlock label="Assigned Professional" lines={[notaryName]} strongFirst />
                  <InfoBlock label="Specialty Commission" lines={["Errors & Omissions Insured"]} strongFirst />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard className="p-5">
            <div className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF2E8] text-[#D57D38] font-bold">
                i
              </span>
              Special Instructions
            </div>
            <div className="rounded-lg bg-[#FFF2EA] px-5 py-4 text-[14px] leading-6 text-[#7E5A49] font-medium border border-[#FFECE0]">
              Please ensure all signatures are completed in blue ink only. Borrower requires a physical copy of the closing disclosure.
              Verify ID against the provided scanbacks meticulously before finishing.
            </div>
          </SectionCard>

          <SectionCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Title Documents</div>
              <button className="text-[12px] font-semibold text-brand-500 hover:text-brand-600 transition focus:outline-none">
                Add Documents
              </button>
            </div>
            <div className="space-y-4">
              {[
                ["Closing_Package.pdf", "4.2 MB • Uploaded 2h ago"],
                ["Instructions_Sheet.pdf", "1.1 MB • Uploaded 2h ago"],
              ].map(([name, meta]) => (
                <div
                  key={name}
                  className="flex items-center gap-4 rounded-xl border border-[#F0F3F8] px-3 py-3 bg-white hover:border-slate-300 transition"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0EF] text-[#EB5B53]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-[14px]">{name}</div>
                    <div className="text-[13px] text-slate-500 mt-0.5">{meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard className="p-4">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Notary Scanbacks</div>
              <span className="rounded-full bg-[#EEF5FF] px-2 py-1 text-[10px] font-semibold text-brand-500">1 New</span>
            </div>
            <div className="rounded-xl border border-line bg-[#F8FAFD] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#EB5B53] shadow-sm border border-slate-100">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-[14px] truncate">Scanback_V1.pdf</div>
                  <div className="text-[13px] text-slate-500 font-medium mt-0.5">Uploaded on {date}</div>
                  <button className="mt-1 text-[12px] font-semibold text-brand-500 hover:text-brand-600 transition focus:outline-none">
                    Preview File
                  </button>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-lg border border-[#EA8D8C] py-3 text-[14px] font-semibold text-[#D94A45] hover:bg-rose-50 transition focus:outline-none">
                  Reject
                </button>
                <button className="rounded-lg bg-[#1EA94B] py-3 text-[14px] font-semibold text-white hover:bg-emerald-600 transition focus:outline-none">
                  Approve
                </button>
              </div>
            </div>
          </SectionCard>
          <ActivityLog
            title="Activity Log"
            items={orderTimeline.map(([title, date, tone]) => ({ title, date, tone }))}
            footer="View Full Audit Trail"
          />
        </div>
      </div>
    </div>
  );
}
