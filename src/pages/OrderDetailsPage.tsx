import { ArrowLeft, Link2, Calendar, MapPin, FileText } from "lucide-react";
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

export function OrderDetailsPage({
  onBack,
  onAssign,
}: {
  onBack: () => void;
  onAssign: () => void;
}) {
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
              <h1 className="text-[18px] font-bold text-slate-900">#ORD-78241</h1>
              <StatusBadge status="Under Review" />
            </div>
            <div className="mt-1 text-[14px] text-slate-500 font-medium">Order created on Oct 20, 2024</div>
          </div>
        </div>
        <div className="flex gap-3">
          <GhostButton className="border-[#AFC6F3] text-brand-500">Change Status</GhostButton>
          <PrimaryButton onClick={onAssign}>Assign Notary</PrimaryButton>
        </div>
      </div>

      <SectionCard className="p-6">
        <StepProgress current={2} stepItems={[...stepItems]} />
      </SectionCard>

      <div className="grid grid-cols-[1.65fr_0.95fr] gap-5">
        <div className="space-y-5">
          <SectionCard className="overflow-hidden">
            <div className="table-head flex items-center justify-between px-5 py-4 bg-slate-50/40">
              <span className="font-semibold text-slate-700">Order Information</span>
              <Link2 size={14} className="text-brand-500" />
            </div>
            <div className="grid grid-cols-2 gap-6 p-5">
              <InfoBlock label="Title Company" lines={["Grand Peak Title"]} strongFirst />
              <InfoBlock label="Signing Date & Time" lines={["Oct 24, 2024 at 2:00 PM"]} strongFirst icons={[Calendar]} />
              <div className="col-span-2">
                <InfoBlock label="Property Address" lines={["452 Pine St, San Francisco, CA 94104"]} strongFirst icons={[MapPin]} />
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-5">
            <div className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF2E8] text-[#D57D38] font-bold">i</span>
              Special Instructions
            </div>
            <div className="rounded-lg bg-[#FFF2EA] px-5 py-4 text-[14px] leading-6 text-[#7E5A49] font-medium border border-[#FFECE0]">
              Please ensure all signatures are in blue ink. Borrower requires a physical copy of the closing disclosure. Verify ID against
              provided scanbacks meticulously.
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
                <div key={name} className="flex items-center gap-4 rounded-xl border border-[#F0F3F8] px-2 py-2 bg-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0EF] text-[#EB5B53]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{name}</div>
                    <div className="text-[13px] text-slate-500">{meta}</div>
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
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">Scanback_V1.pdf</div>
                  <div className="text-[13px] text-slate-500 font-medium">Uploaded on Oct 24, 2024 at 4:15 PM</div>
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
