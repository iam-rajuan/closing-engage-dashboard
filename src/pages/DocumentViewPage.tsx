import { useAppContext } from "../context/AppContext";
import { StatusBadge, GhostButton, PrimaryButton, SectionCard, FilePreview, KeyValue } from "../components/common";
import { Upload, Download, Search, MoreVertical, ShieldCheck, UserPlus, MapPin } from "lucide-react";
import { documentTimeline } from "../data";

export function DocumentViewPage({ onBack }: { onBack: () => void }) {
  const { setDocuments } = useAppContext();

  const handleApprove = () => {
    setDocuments((prev: any) =>
      prev.map((d: any) =>
        d[0] === "Closing_Disclosure_Fina..." ? [d[0], d[1], d[2], d[3], d[4], "Approved"] : d
      )
    );
  };

  const handleReject = () => {
    setDocuments((prev: any) =>
      prev.map((d: any) =>
        d[0] === "Closing_Disclosure_Fina..." ? [d[0], d[1], d[2], d[3], d[4], "Rejected"] : d
      )
    );
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-[12px] font-semibold text-brand-500 hover:text-brand-600 transition focus:outline-none">
        ← Back to Documents
      </button>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold leading-none text-slate-900">Closing_Disclosure_Final.pdf</h1>
            <StatusBadge status="Pending Review" />
          </div>
          <div className="mt-2 flex items-center gap-4 text-[14px] text-slate-500">
            <span>
              Order ID: <span className="font-semibold text-brand-500">#ORD-882190</span>
            </span>
            <span className="font-medium">Priority: High</span>
          </div>
        </div>
        <div className="flex gap-3">
          <GhostButton>
            <Upload size={15} />
            Share
          </GhostButton>
          <PrimaryButton>
            <Download size={15} />
            Version History
          </PrimaryButton>
        </div>
      </div>
      <div className="grid grid-cols-[1.6fr_0.78fr] gap-5">
        <SectionCard className="overflow-hidden p-0 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3">
            <div className="flex items-center gap-3 text-[12px] font-semibold text-slate-600">
              <button className="rounded bg-[#F2F5FA] px-3 py-1 hover:bg-slate-100 transition focus:outline-none">−</button>
              <span>100%</span>
              <button className="rounded bg-[#F2F5FA] px-3 py-1 hover:bg-slate-100 transition focus:outline-none">+</button>
            </div>
            <div className="text-[12px] font-semibold text-slate-600">Page 1 of 5</div>
            <div className="flex items-center gap-4 text-slate-500">
              <Download size={15} className="cursor-pointer hover:text-slate-700 transition" />
              <Search size={15} className="cursor-pointer hover:text-slate-700 transition" />
              <MoreVertical size={15} className="cursor-pointer hover:text-slate-700 transition" />
            </div>
          </div>
          <div className="bg-[#DDE6F2] p-8">
            <FilePreview />
          </div>
        </SectionCard>
        <div className="space-y-5">
          <SectionCard className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Verification Action</div>
            <div className="space-y-3">
              <button
                onClick={handleApprove}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-[14px] font-semibold text-white shadow-md hover:bg-brand-600 transition focus:outline-none"
              >
                <ShieldCheck size={16} />
                Approve Document
              </button>
              <button
                onClick={handleReject}
                className="w-full rounded-lg border border-[#EF9B98] py-3 text-[14px] font-semibold text-[#DD514B] hover:bg-rose-50 transition focus:outline-none"
              >
                Reject &amp; Request Changes
              </button>
              <button className="w-full rounded-lg bg-[#EEF3FA] py-3 text-[14px] font-semibold text-slate-600 hover:bg-slate-200 transition focus:outline-none">
                Download File
              </button>
            </div>
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">File Information</div>
            <KeyValue
              rows={[
                ["Size", "1.2 MB"],
                ["Type", "PDF Document"],
                ["Upload Date", "Oct 24, 2023"],
                ["Uploaded By", "Northway Holdings"],
              ]}
            />
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Order Context</div>
            <div className="space-y-3 text-[14px]">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded bg-[#EEF5FF] p-2 text-brand-500">
                  <UserPlus size={14} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Assigned Notary</div>
                  <div className="font-semibold text-slate-700">Jane Simmons</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded bg-[#EEF5FF] p-2 text-brand-500">
                  <MapPin size={14} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Property Location</div>
                  <div className="font-semibold text-slate-700">123 Maple St, Austin, TX</div>
                </div>
              </div>
            </div>
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Activity Log</div>
            <div className="space-y-5">
              {documentTimeline.map(([title, date, tone], index) => (
                <div key={title} className="relative flex gap-4">
                  <div className="relative mt-1 flex flex-col items-center">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full ${
                        tone === "blue" ? "border-2 border-brand-500 text-brand-500" : "border-2 border-[#D8E1EE] text-transparent"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${tone === "blue" ? "bg-brand-500" : "bg-[#D8E1EE]"}`} />
                    </div>
                    {index < documentTimeline.length - 1 ? <div className="mt-2 h-10 w-px bg-[#E7ECF4]" /> : null}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-slate-700">{title}</div>
                    <div className="text-[12px] text-slate-400 font-medium">{date}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-500 hover:text-brand-600 transition focus:outline-none">
              View Full History
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
