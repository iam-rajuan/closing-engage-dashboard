import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, DropdownField, SimpleStatCard } from "../components/common";
import { DocumentTable } from "../components/tables";
import { useToast } from "../components/Toast";
import { documentsApi } from "../api/documents";

export function DocumentsPage({ onOpenDocument }: { onOpenDocument: (doc: any) => void }) {
  const { documents: documentRows, setDocuments, showConfirm } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("File Type: All");
  const [uploadedByFilter, setUploadedByFilter] = useState("Uploaded By: All");
  const [statusFilter, setStatusFilter] = useState("Status: All");
  const [dateRangeFilter, setDateRangeFilter] = useState("Date Range: All");
  const { showToast } = useToast();

  const filteredDocuments = documentRows.filter(([fileName, orderId, uploadedBy, , , status]) => {
    const matchesSearch = `${fileName} ${orderId}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    // File Type parsing from file extension
    const extension = fileName.split('.').pop()?.toUpperCase() || "";
    const cleanFileType = fileTypeFilter.replace("File Type: ", "");
    const matchesFileType = cleanFileType === "All" ? true : extension === cleanFileType;

    // Uploaded By filter
    const cleanUploadedBy = uploadedByFilter.replace("Uploaded By: ", "");
    const matchesUploadedBy = cleanUploadedBy === "All" ? true : uploadedBy === cleanUploadedBy;

    // Status filter - matching dropdown value "Pending Review" with data value "Pending"
    const cleanStatus = statusFilter.replace("Status: ", "");
    const matchesStatus =
      cleanStatus === "All"
        ? true
        : cleanStatus === "Pending Review"
        ? status === "Pending"
        : status === cleanStatus;

    return matchesSearch && matchesFileType && matchesUploadedBy && matchesStatus;
  });

  const handleDeleteDocument = (fileName: string) => {
    const targetDocument = documentRows.find((doc: any) => doc[0] === fileName);
    const documentId = targetDocument?.[6];

    showConfirm(
      "Delete Document?",
      `Are you sure you want to permanently remove ${fileName} from the transaction pipeline? This action cannot be undone.`,
      async () => {
        try {
          if (documentId) {
            await documentsApi.deleteDocument(documentId);
          }
          setDocuments((prev: any[]) => prev.filter((doc) => doc[0] !== fileName));
          showToast("Document deleted successfully", { variant: "success" });
        } catch (error) {
          showToast(error instanceof Error ? error.message : "Document delete failed", { variant: "error" });
        }
      },
      "Delete",
      "danger"
    );
  };

  const handleDownloadDocument = async (fileName: string) => {
    showToast(`Downloading ${fileName}...`, { variant: "info" });
    try {
      const targetDocument = documentRows.find((doc: any) => doc[0] === fileName);
      const documentId = targetDocument?.[6];
      const url = documentId ? await documentsApi.getDownloadUrl(documentId) : "/sample.pdf";
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      showToast(`File ${fileName} downloaded successfully!`, { variant: "success" });
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback
      const link = document.createElement("a");
      link.href = "/sample.pdf";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
        <DropdownField
          label={fileTypeFilter}
          options={["File Type: All", "PDF", "JPG", "PNG"]}
          onSelect={setFileTypeFilter}
          widthClass="w-full"
        />
        <DropdownField
          label={uploadedByFilter}
          options={["Uploaded By: All", "TITLE COMPANY", "NOTARY", "BUYER"]}
          onSelect={setUploadedByFilter}
          widthClass="w-full"
        />
        <DropdownField
          label={statusFilter}
          options={["Status: All", "Pending Review", "Approved", "Rejected"]}
          onSelect={setStatusFilter}
          widthClass="w-full"
        />
        <DropdownField
          label={dateRangeFilter}
          options={["Date Range: All", "Last 7 Days", "Last 30 Days", "This Month"]}
          onSelect={setDateRangeFilter}
          icon={<Calendar size={16} className="text-slate-400" />}
          widthClass="w-full"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <SimpleStatCard title="Total Files" value={documentRows.length.toLocaleString()} note="+12% this month" icon="folder" />
        <SimpleStatCard
          title="Needs Approval"
          value={documentRows.filter((d) => d[5] === "Pending").length.toString()}
          note="Action required"
          icon="approval"
        />
        <SimpleStatCard title="Storage Health" value="62%" note="" icon="cloud" progress={62} />
      </div>
      <DocumentTable
        onOpenDocument={onOpenDocument}
        onDeleteDocument={handleDeleteDocument}
        onDownloadDocument={handleDownloadDocument}
        rows={filteredDocuments}
      />
    </div>
  );
}
