import { useMemo, useState } from "react";
import { Search, Calendar } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, DropdownField, SimpleStatCard } from "../components/common";
import { DocumentTable } from "../components/tables";
import { useToast } from "../components/Toast";
import { documentsApi, type DocumentTableRow } from "../api/documents";

const parseDocumentDate = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getObjectIdTimestamp = (value?: string) => {
  if (!value || value.length < 8) {
    return 0;
  }

  const seconds = Number.parseInt(value.slice(0, 8), 16);
  return Number.isNaN(seconds) ? 0 : seconds * 1000;
};

const getDocumentSortTime = (row: DocumentTableRow) =>
  parseDocumentDate(row[8]) || getObjectIdTimestamp(row[6]) || parseDocumentDate(row[3]);

const getUploaderCategory = (row: DocumentTableRow) => {
  const role = row[7];

  if (role === "admin") return "Admin";
  if (role === "notary") return "Notary";
  if (role === "company" || role === "title-company") return "Company";

  const uploadedBy = row[2].toUpperCase();

  if (uploadedBy.includes("ADMIN")) return "Admin";
  if (uploadedBy.includes("NOTARY")) return "Notary";
  return "Company";
};

const isWithinDateRange = (value: string, filter: string) => {
  const timestamp = parseDocumentDate(value);

  if (!timestamp || filter === "All") {
    return true;
  }

  const now = new Date();
  const currentTime = now.getTime();
  const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;

  if (filter === "Last 7 Days") {
    return timestamp >= sevenDaysAgo;
  }

  if (filter === "Last 30 Days") {
    return timestamp >= thirtyDaysAgo;
  }

  if (filter === "This Month") {
    const documentDate = new Date(timestamp);
    return (
      documentDate.getFullYear() === now.getFullYear() &&
      documentDate.getMonth() === now.getMonth()
    );
  }

  return true;
};

export function DocumentsPage({ onOpenDocument }: { onOpenDocument: (doc: any) => void }) {
  const { documents: documentRows, setDocuments, showConfirm } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("All");
  const [uploadedByFilter, setUploadedByFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Newest");
  const { showToast } = useToast();

  const fileTypeOptions = useMemo(() => {
    const extensions = Array.from(
      new Set(
        documentRows
          .map((row: DocumentTableRow) => row[0].split(".").pop()?.toUpperCase())
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return ["All", ...extensions];
  }, [documentRows]);

  const uploadedByOptions = ["All", "Admin", "Company", "Notary"];

  const filteredDocuments = useMemo(() => {
    const rows = documentRows.filter((row: DocumentTableRow) => {
      const [fileName, orderId, , uploadDate, , status] = row;
      const matchesSearch = `${fileName} ${orderId}`.toLowerCase().includes(searchQuery.toLowerCase());
      const extension = fileName.split(".").pop()?.toUpperCase() || "";
      const matchesFileType = fileTypeFilter === "All" || extension === fileTypeFilter;
      const matchesUploadedBy = uploadedByFilter === "All" || getUploaderCategory(row) === uploadedByFilter;
      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Pending Review"
            ? status === "Pending"
            : status === statusFilter;
      const matchesDateRange = isWithinDateRange(uploadDate, dateRangeFilter);

      return matchesSearch && matchesFileType && matchesUploadedBy && matchesStatus && matchesDateRange;
    });

    return [...rows].sort((a: DocumentTableRow, b: DocumentTableRow) => {
      const dateDifference = getDocumentSortTime(b) - getDocumentSortTime(a);
      if (dateDifference !== 0) {
        return sortFilter === "Oldest" ? -dateDifference : dateDifference;
      }

      const idDifference = getObjectIdTimestamp(b[6]) - getObjectIdTimestamp(a[6]);
      if (idDifference !== 0) {
        return sortFilter === "Oldest" ? -idDifference : idDifference;
      }

      const fileNameDifference = a[0].localeCompare(b[0]);
      if (fileNameDifference !== 0) {
        return fileNameDifference;
      }

      return a[6].localeCompare(b[6]);
    });
  }, [dateRangeFilter, documentRows, fileTypeFilter, searchQuery, sortFilter, statusFilter, uploadedByFilter]);

  const handleDeleteDocument = (documentRow: DocumentTableRow) => {
    const [fileName, , , , , , documentId] = documentRow;

    showConfirm(
      "Delete Document?",
      `Are you sure you want to permanently remove ${fileName} from the transaction pipeline? This action cannot be undone.`,
      async () => {
        try {
          await documentsApi.deleteDocument(documentId);
          setDocuments((prev: DocumentTableRow[]) => prev.filter((doc) => doc[6] !== documentId));
          showToast("Document deleted successfully", { variant: "success" });
        } catch (error) {
          showToast(error instanceof Error ? error.message : "Document delete failed", { variant: "error" });
        }
      },
      "Delete",
      "danger"
    );
  };

  const handleDownloadDocument = async (documentRow: DocumentTableRow) => {
    const [fileName, , , , , , documentId] = documentRow;

    showToast(`Downloading ${fileName}...`, { variant: "info" });
    try {
      const url = await documentsApi.getDownloadUrl(documentId);
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
      showToast(error instanceof Error ? error.message : "Document download failed", { variant: "error" });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Documents" description="Manage and access all uploaded files within the transaction pipeline." />
      <div className="grid grid-cols-[1.45fr_repeat(5,0.58fr)] gap-3">
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
          label={`File Type: ${fileTypeFilter}`}
          options={fileTypeOptions.map((value) => `File Type: ${value}`)}
          onSelect={(value) => setFileTypeFilter(value.replace("File Type: ", ""))}
          widthClass="w-full"
        />
        <DropdownField
          label={`Uploaded By: ${uploadedByFilter}`}
          options={uploadedByOptions.map((value) => `Uploaded By: ${value}`)}
          onSelect={(value) => setUploadedByFilter(value.replace("Uploaded By: ", ""))}
          widthClass="w-full"
        />
        <DropdownField
          label={`Status: ${statusFilter}`}
          options={["All", "Pending Review", "Approved", "Rejected"].map((value) => `Status: ${value}`)}
          onSelect={(value) => setStatusFilter(value.replace("Status: ", ""))}
          widthClass="w-full"
        />
        <DropdownField
          label={dateRangeFilter === "All" ? "Date Range: All" : dateRangeFilter}
          options={["All", "Last 7 Days", "Last 30 Days", "This Month"]}
          onSelect={setDateRangeFilter}
          icon={<Calendar size={16} className="text-slate-400" />}
          widthClass="w-full"
        />
        <DropdownField
          label={`Sort: ${sortFilter}`}
          options={["Newest", "Oldest"].map((value) => `Sort: ${value}`)}
          onSelect={(value) => setSortFilter(value.replace("Sort: ", ""))}
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
