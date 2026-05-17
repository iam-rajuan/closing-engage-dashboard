import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Link2, Calendar, MapPin, FileText, User, X, Eye, Download } from "lucide-react";
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
import { Modal } from "../components/modals/Modal";
import { useToast } from "../components/Toast";
import { stepItems } from "../data";
import type { StatusKey } from "../types";
import { DocumentMockPreview } from "../components/DocumentMockPreview";

export function OrderDetailsPage({
  orderId,
  onBack,
  onAssign,
}: {
  orderId: string | null;
  onBack: () => void;
  onAssign: () => void;
}) {
  const { orders, setOrders } = useAppContext();
  const { showToast } = useToast();
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);

  const [localDocs, setLocalDocs] = useState([
    { name: "Closing_Package.pdf", meta: "4.2 MB • Uploaded 2h ago" },
    { name: "Instructions_Sheet.pdf", meta: "1.1 MB • Uploaded 2h ago" },
  ]);

  const [localLogs, setLocalLogs] = useState([
    { title: "Order created by System", date: "Oct 20, 2024 • 09:45 AM", tone: "blue" },
    { title: "Notary John Doe assigned", date: "Oct 21, 2024 • 02:20 PM", tone: "slate" },
    { title: "Documents uploaded by John Doe", date: "Oct 24, 2024 • 04:15 PM", tone: "green" },
  ]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setStatusDropdownOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const isAnyModalOpen = showPreviewModal || showRejectModal || showAuditTrailModal;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreviewModal, showRejectModal, showAuditTrailModal]);

  // Dynamically load the matching order or fallback to the first active order
  const activeOrder = useMemo(() => {
    if (!orderId) return orders[0] || ["#ORD-78241", "Grand Peak Title", "GP", "Sarah Harrison", "San Francisco, CA", "Oct 24, 2024", "Under Review", "jane"];
    return orders.find((o) => o[0] === orderId) || orders[0];
  }, [orders, orderId]);

  if (!activeOrder) return null;

  const [id, company, , notaryName, location, date, status, avatar] = activeOrder;

  // Dynamically determine the timeline progress index based on status
  const currentStep = useMemo(() => {
    if (status === "Completed") return 4;
    if (status === "Approved") return 3;
    if (status === "Under Review" || status === "Rejected") return 2;
    if (status === "Assigned") return 1;
    return 0; // Received
  }, [status]);

  const handleStatusChange = (newStatus: string) => {
    setOrders((prev: any) =>
      prev.map((o: any) =>
        o[0] === id
          ? [o[0], o[1], o[2], o[3], o[4], o[5], newStatus, o[7]]
          : o
      )
    );
    setLocalLogs((prev) => [
      { title: `Order status changed to "${newStatus}"`, date: "Just now", tone: "blue" },
      ...prev,
    ]);
    showToast("Status Updated", { message: `Order status successfully changed to ${newStatus}.`, variant: "success" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setLocalDocs((prev) => [
        ...prev,
        {
          name: file.name,
          meta: `${sizeMB} MB • Uploaded just now`
        }
      ]);
      setLocalLogs((prev) => [
        { title: `Document "${file.name}" uploaded by Admin`, date: "Just now", tone: "blue" },
        ...prev,
      ]);
      showToast("Document Uploaded", { message: `"${file.name}" has been uploaded.`, variant: "success" });
    }
  };

  const handleReject = () => {
    setOrders((prev: any) =>
      prev.map((o: any) =>
        o[0] === id
          ? [o[0], o[1], o[2], o[3], o[4], o[5], "Rejected", o[7]]
          : o
      )
    );
    setLocalLogs((prev) => [
      { title: "Scanback Rejected by Admin", date: "Just now", tone: "red" },
      ...prev,
    ]);
    setShowRejectModal(false);
    showToast("Scanback Rejected", { message: "The scanback document was marked as rejected.", variant: "error" });
  };

  const handleApprove = () => {
    setOrders((prev: any) =>
      prev.map((o: any) =>
        o[0] === id
          ? [o[0], o[1], o[2], o[3], o[4], o[5], "Approved", o[7]]
          : o
      )
    );
    setLocalLogs((prev) => [
      { title: "Scanback Approved by Admin", date: "Just now", tone: "green" },
      ...prev,
    ]);
    showToast("Scanback Approved", { message: "The scanback document was marked as approved.", variant: "success" });
  };

  return (
    <div className="space-y-5">
      <input
        id="file-upload-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
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
        <div className="flex gap-3 relative">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatusDropdownOpen(!statusDropdownOpen);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-300 text-brand-600 bg-brand-50/50 hover:bg-brand-50 px-5 py-3 text-sm font-semibold transition w-[140px] h-[46px] justify-center rounded-lg focus:outline-none"
            >
              Change Status
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-1 shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {["Received", "Assigned", "Under Review", "Approved", "Completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      handleStatusChange(s);
                      setStatusDropdownOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-[13px] font-medium transition ${
                      status === s ? "text-brand-600 bg-brand-50/30 font-semibold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
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
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Title Documents</div>
              <button
                onClick={() => document.getElementById("file-upload-input")?.click()}
                className="text-[12px] font-semibold text-brand-500 hover:text-brand-600 transition focus:outline-none"
              >
                Add Documents
              </button>
            </div>
            <div className="space-y-4">
              {localDocs.map(({ name, meta }) => (
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
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#c3daf9] bg-white px-3 py-1.5 text-[12px] font-bold text-brand-500 shadow-sm hover:bg-[#EEF5FF] hover:border-brand-500 transition focus:outline-none"
                    >
                      <Eye size={14} className="text-brand-500" />
                      Preview
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = "/sample.pdf";
                        link.download = "Scanback_V1.pdf";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast("Downloading File", { message: "Scanback_V1.pdf download started.", variant: "success" });
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-650 shadow-sm hover:bg-slate-50 transition focus:outline-none"
                    >
                      <Download size={14} className="text-slate-550 text-slate-500" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="rounded-lg border border-[#EA8D8C] py-3 text-[14px] font-semibold text-[#D94A45] hover:bg-rose-50 transition focus:outline-none"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="rounded-lg bg-[#1EA94B] py-3 text-[14px] font-semibold text-white hover:bg-emerald-600 transition focus:outline-none"
                >
                  Approve
                </button>
              </div>
            </div>
          </SectionCard>
          <ActivityLog
            title="Activity Log"
            items={localLogs}
            footer="View Full Audit Trail"
            onFooterClick={() => setShowAuditTrailModal(true)}
          />
        </div>
      </div>

      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)} widthClass="max-w-[420px]">
          <div className="p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900">Reject Notary Scanback</h2>
                <p className="text-[14px] text-slate-500 mt-1">Are you sure you want to reject this document? This will update the order status to Rejected.</p>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-650 focus:outline-none">
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2.5 text-[14px] font-semibold text-slate-500 hover:text-slate-700 transition focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="rounded-lg bg-rose-600 px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-rose-700 transition shadow-[0_8px_18px_rgba(220,38,38,0.2)] focus:outline-none"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showPreviewModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 md:p-10 backdrop-blur-[3px] bg-slate-900/25 animate-in fade-in duration-300">
          <div className="w-full max-w-[1180px] h-full max-h-[90vh] flex flex-col bg-[#0f172a] rounded-[24px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.3)] border border-slate-700/50">
            {/* Professional Header Console */}
            <div className="flex items-center justify-between px-8 py-5 bg-[#1e293b] border-b border-slate-700/50">
              <div className="flex items-center gap-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-500/20 text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-[18px] font-black text-white tracking-tight leading-none">Scanback_V1.pdf</div>
                  <div className="mt-1 text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">High-Fidelity Document Inspection</div>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600 text-white transition-all duration-300 border border-slate-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 bg-[#1e293b] p-8 flex justify-center items-center overflow-auto">
              <div className="w-[390px] h-[520px] rounded-lg border border-slate-700/50 bg-white shadow-2xl overflow-hidden shrink-0">
                <DocumentMockPreview fileName="Scanback_V1.pdf" />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showAuditTrailModal && (
        <Modal onClose={() => setShowAuditTrailModal(false)} widthClass="max-w-[580px]">
          <div className="p-6 text-left">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900">Complete Order Audit Trail</h2>
                <p className="text-[13px] text-slate-550 text-slate-500 mt-1">
                  Comprehensive tamper-evident ledger of transactions, status transitions, and user logs for Order {id}.
                </p>
              </div>
              <button
                onClick={() => setShowAuditTrailModal(false)}
                className="text-slate-400 hover:text-slate-650 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto pr-1 space-y-4 my-6">
              {localLogs.map((log, index) => {
                return (
                  <div key={`${log.title}-${index}`} className="rounded-xl border border-slate-100 bg-[#F9FBFE] p-4 text-left">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          log.tone === "green"
                            ? "bg-[#2E9F54]"
                            : log.tone === "red"
                              ? "bg-[#D25753]"
                              : log.tone === "blue"
                                ? "bg-brand-500"
                                : "bg-slate-400"
                        }`} />
                        <span className="text-[14px] font-bold text-slate-800">{log.title}</span>
                      </div>
                      <span className="text-[12px] font-semibold text-slate-400">{log.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowAuditTrailModal(false)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm focus:outline-none"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
