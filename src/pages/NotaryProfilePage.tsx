import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/Toast";
import {
  GhostButton,
  PrimaryButton,
  SectionCard,
  Avatar,
  InfoBlock,
  TableHeader,
  StatusBadge,
} from "../components/common";
import { Eye, FileText, Download, ArrowLeft, Plus, Trash2, X, ShieldCheck } from "lucide-react";
import { profileGradients, uploadActivity } from "../data";
import type { StatusKey, NotaryUser } from "../types";

export function NotaryProfilePage({
  notary,
  onBack,
  onEdit,
  onViewOrder,
  onViewAllOrders,
}: {
  notary: NotaryUser | null;
  onBack: () => void;
  onEdit: (notary: NotaryUser) => void;
  onViewOrder?: (orderId: string) => void;
  onViewAllOrders?: () => void;
}) {
  const { setNotaries, showConfirm, orders } = useAppContext();
  const { showToast } = useToast();

  if (!notary) {
    return (
      <div className="space-y-4 py-8 text-center bg-white rounded-xl border border-line">
        <p className="text-slate-500 font-medium">No notary selected.</p>
        <GhostButton onClick={onBack}>&larr; Back to Notaries</GhostButton>
      </div>
    );
  }

  // Simulated backend API state loaders
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  // File selection and discard/cancel uploads tracking
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [uploadIntervalId, setUploadIntervalId] = useState<any>(null);

  // Dynamic uploads state with localStorage persistence for a real database feel
  const [uploadedDocs, setUploadedDocs] = useState<any[]>(() => {
    const saved = localStorage.getItem(`notary_docs_${notary.id}`);
    return saved ? JSON.parse(saved) : uploadActivity;
  });

  useEffect(() => {
    localStorage.setItem(`notary_docs_${notary.id}`, JSON.stringify(uploadedDocs));
  }, [uploadedDocs, notary.id]);

  // Clean up upload interval on unmount
  useEffect(() => {
    return () => {
      if (uploadIntervalId) {
        clearInterval(uploadIntervalId);
      }
    };
  }, [uploadIntervalId]);

  // Simulated Verify / Approve Notary request
  const handleVerify = () => {
    const isCurrentlyVerified = !!notary.verify;
    const actionText = isCurrentlyVerified ? "Revoke" : "Verify";
    const variant = isCurrentlyVerified ? "warning" : "info";

    showConfirm(
      `${isCurrentlyVerified ? "Revoke Verification" : "Verify Notary"}?`,
      `Are you sure you want to ${isCurrentlyVerified ? "revoke verification for" : "verify and approve"} ${notary.fullName}? This will instantly update their system authorization status.`,
      () => {
        setIsVerifying(true);
        setTimeout(() => {
          setNotaries((prev) =>
            prev.map((n) =>
              n.id === notary.id
                ? { ...n, verify: !isCurrentlyVerified }
                : n
            )
          );
          setIsVerifying(false);
          showToast(
            `Notary successfully ${isCurrentlyVerified ? "verification revoked" : "verified & certified"}!`,
            { variant: "success" }
          );
        }, 850);
      },
      isCurrentlyVerified ? "Revoke" : "Verify",
      variant
    );
  };

  // Toggle Account Active / Inactive status
  const handleToggleStatus = () => {
    const isCurrentlyActive = notary.status === "Active";
    const actionText = isCurrentlyActive ? "Deactivate" : "Activate";
    const variant = isCurrentlyActive ? "warning" : "info";

    showConfirm(
      `${actionText} Notary?`,
      `Are you sure you want to ${isCurrentlyActive ? "deactivate" : "activate"} ${notary.fullName}? This will instantly update their portal access status.`,
      () => {
        setIsVerifying(true);
        setTimeout(() => {
          setNotaries((prev) =>
            prev.map((n) =>
              n.id === notary.id
                ? { ...n, status: isCurrentlyActive ? "Inactive" : "Active" }
                : n
            )
          );
          setIsVerifying(false);
          showToast(
            `Notary successfully ${isCurrentlyActive ? "deactivated" : "activated"}!`,
            { variant: "success" }
          );
        }, 850);
      },
      actionText,
      variant
    );
  };

  // Simulated Delete API request
  const handleDelete = () => {
    showConfirm(
      "Delete Notary?",
      `Are you sure you want to permanently delete ${notary.fullName}? This will revoke their platform credentials immediately and cannot be undone.`,
      () => {
        setIsDeleting(true);
        setTimeout(() => {
          setNotaries((prev) => prev.filter((n) => n.id !== notary.id));
          setIsDeleting(false);
          onBack();
        }, 800);
      },
      "Delete",
      "danger"
    );
  };

  // Simulated document download action with spinner
  const handleDownload = (docName: string) => {
    setDownloadingDoc(docName);
    setTimeout(() => {
      setDownloadingDoc(null);
      showToast(`Downloaded ${docName} successfully!`, { variant: "success" });
    }, 1100);
  };

  // Trigger system file dialog
  const handleUploadDocumentClick = () => {
    document.getElementById("notary-pdf-uploader")?.click();
  };

  // Real local file picker integration with live cancel support
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadingFileName(file.name);
    setUploadProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadIntervalId(null);
        setTimeout(() => {
          const today = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          setUploadedDocs((prev) => [[file.name, `Uploaded ${today}`], ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setUploadingFileName(null);
          showToast(`Uploaded ${file.name} successfully!`, { variant: "success" });
        }, 350);
      }
    }, 150);

    setUploadIntervalId(interval);
    // Reset file input value so same file can be re-uploaded
    e.target.value = "";
  };

  // Cancel / Discard currently running progress
  const handleDiscardUpload = () => {
    if (uploadIntervalId) {
      clearInterval(uploadIntervalId);
      setUploadIntervalId(null);
    }
    setIsUploading(false);
    setUploadProgress(0);
    setUploadingFileName(null);
    showToast("Document upload discarded.", { variant: "info" });
  };

  // Delete / Discard already uploaded documents
  const handleDeleteDocument = (docName: string) => {
    showConfirm(
      "Delete Document?",
      `Are you sure you want to permanently delete the document "${docName}" from this notary's credentials list?`,
      () => {
        setUploadedDocs((prev) => prev.filter(([title]) => title !== docName));
        showToast(`Successfully deleted ${docName}!`, { variant: "success" });
      },
      "Delete",
      "danger"
    );
  };

  // Dynamic assigned orders lookup from global context state
  const notaryOrders = useMemo(() => {
    // If the notary has matching assigned orders in global state, render them
    const matches = orders.filter((o) => o[3] === notary.fullName);
    if (matches.length > 0) {
      return matches.map((o) => ({
        id: o[0],
        status: o[6],
        date: o[5],
      }));
    }
    // Fallback to high-fidelity, realistic mock orders tailored to their specialty
    if (notary.fullName.toLowerCase().includes("sarah")) {
      return [
        { id: "#ORD-90212", status: "In Progress", date: "Oct 24, 2023" },
        { id: "#ORD-90208", status: "Approved", date: "Oct 22, 2023" },
        { id: "#ORD-88421", status: "Completed", date: "Oct 18, 2023" },
      ];
    }
    return [
      { id: "#ORD-77401", status: "Completed", date: "May 10, 2026" },
      { id: "#ORD-77290", status: "Assigned", date: "May 08, 2026" },
    ];
  }, [orders, notary.fullName]);

  // Select profile gradient based on name or fallback to a gorgeous default
  const getGradient = () => {
    if (notary.fullName.toLowerCase().includes("sarah")) return profileGradients.jane;
    if (notary.fullName.toLowerCase().includes("james")) return profileGradients.mark;
    return profileGradients.alex;
  };

  return (
    <div className="space-y-5">
      {/* Hidden native input for system local file selection */}
      <input
        id="notary-pdf-uploader"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-semibold tracking-wide">
        <button onClick={onBack} className="hover:text-brand-500 transition">
          Notaries
        </button>
        <span>&nbsp;›&nbsp;</span>
        <span className="text-slate-700">{notary.fullName}</span>
      </div>

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
              <h1 className="text-[20px] font-bold text-slate-900">{notary.fullName}</h1>
              <StatusBadge status={notary.status as StatusKey} />
              {notary.verify ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  Verified
                </span>
              ) : (
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 hover:bg-brand-100 px-2.5 py-0.5 text-[12px] font-semibold text-brand-700 border border-brand-200 hover:border-brand-300 transition focus:outline-none"
                >
                  {isVerifying ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-700 border-t-transparent shrink-0" />
                  ) : (
                    <>
                      <ShieldCheck size={14} className="text-brand-600 shrink-0" />
                      Verify
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="mt-1 text-[14px] text-slate-500 font-medium">Created on {notary.createdDate}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <GhostButton
            onClick={() => onEdit(notary)}
            disabled={isDeleting || isVerifying}
            className="w-[140px] h-[46px] justify-center border-brand-300 text-brand-600 bg-brand-50/50 hover:bg-brand-50 px-0 rounded-lg text-sm font-semibold"
          >
            Edit Notary
          </GhostButton>
          <GhostButton
            onClick={handleToggleStatus}
            disabled={isVerifying || isDeleting}
            className={`w-[140px] h-[46px] justify-center px-0 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              notary.status === "Active"
                ? "border-amber-200 text-amber-600 bg-amber-50/30 hover:bg-amber-50"
                : "border-emerald-200 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-50"
            }`}
          >
            {isVerifying ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : notary.status === "Active" ? (
              "Deactivate"
            ) : (
              "Activate"
            )}
          </GhostButton>
          <PrimaryButton
            onClick={handleDelete}
            disabled={isDeleting || isVerifying}
            className="w-[140px] h-[46px] justify-center bg-rose-500 hover:bg-rose-600 text-white shadow-[0_8px_18px_rgba(244,63,94,0.2)] px-0 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Delete Notary"
            )}
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_0.95fr] gap-5">
        <SectionCard className="p-7">
          <div className="flex items-start gap-6">
            <div className="relative overflow-hidden rounded-[22px] border border-[#D4E3FB] bg-[#E7F0FF] p-2">
              <Avatar className="h-[98px] w-[98px] rounded-[18px]" gradient={getGradient()} />
              <div className="absolute bottom-2 right-2 rounded-full bg-[#EEF5FF] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-500 shadow-sm">
                {notary.status}
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-6">
              <InfoBlock label="Email Address" lines={[notary.email]} strongFirst />
              <InfoBlock label="Phone Number" lines={[notary.phone]} strongFirst />
              <InfoBlock label="Notary License" lines={[notary.license]} strongFirst />
              <InfoBlock label="Location Base" lines={[notary.serviceArea || "Not specified"]} strongFirst />
            </div>
          </div>
        </SectionCard>
        <div className="rounded-2xl bg-[#2866D1] p-8 text-white shadow-[0_12px_30px_rgba(40,102,209,0.22)]">
          <h3 className="text-[18px] font-bold tracking-tight">Professional Credentials</h3>
          <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Commission Expiry</div>
          <div className="mt-2 text-[20px] font-semibold">{notary.expiry || "12/31/2026"}</div>
          <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Service Area</div>
          <div className="mt-2 max-w-[220px] text-[16px] leading-7 text-white/85">
            {notary.serviceArea || "Greater Metropolitan Area Base"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1.65fr_1fr] gap-5">
        <SectionCard className="overflow-hidden">
          <TableHeader title="Assigned Orders" action="View All Orders" onAction={onViewAllOrders} />
          <div className="overflow-x-auto">
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
                {notaryOrders.map((o) => (
                  <tr key={o.id} className="border-t border-line text-[14px]">
                    <td className="px-6 py-4 font-semibold text-slate-700">{o.id}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status as StatusKey} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{o.date}</td>
                    <td className="px-6 py-4 text-right text-brand-500">
                      <button
                        onClick={() => onViewOrder?.(o.id)}
                        className="ml-auto hover:text-brand-600 focus:outline-none transition flex items-center justify-end"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard className="p-6">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
            <h3 className="text-[18px] font-semibold text-slate-900">Upload Activity</h3>
            <button
              onClick={handleUploadDocumentClick}
              disabled={isUploading}
              className="text-[12px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-md transition focus:outline-none flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Upload Document
                </>
              )}
            </button>
          </div>

          {isUploading && (
            <div className="mb-5 rounded-xl border border-dashed border-brand-200 bg-brand-50/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold text-slate-500 truncate max-w-[170px]">
                  Uploading {uploadingFileName}...
                </span>
                <span className="text-[12px] font-bold text-brand-600 flex items-center gap-2">
                  {uploadProgress}%
                  <button
                    onClick={handleDiscardUpload}
                    className="p-1 hover:bg-slate-200/80 rounded text-slate-400 hover:text-rose-500 transition focus:outline-none"
                    title="Discard Upload"
                  >
                    <X size={14} />
                  </button>
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {uploadedDocs.map(([title, date]) => (
              <div key={title} className="flex items-center gap-4 rounded-xl border border-line px-4 py-3.5 hover:border-slate-300 hover:bg-slate-50/50 transition">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-[14px] truncate">{title}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{date}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(title)}
                    disabled={downloadingDoc !== null}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    {downloadingDoc === title ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(title)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition focus:outline-none"
                    title="Discard Document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
