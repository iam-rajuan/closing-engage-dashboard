import { adminAuth } from "./auth";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type DocumentTableRow = [string, string, string, string, string, "Pending" | "Approved" | "Rejected", string];

interface DocumentDetail {
  id: string;
  fileName: string;
  orderNumber: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  displayStatus: "Pending" | "Approved" | "Submitted" | "Verified";
  status: "Pending Review" | "Approved" | "Rejected" | "Submitted" | "Pending" | "Verified";
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = adminAuth.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Request failed");
  }

  return result.data;
};

const toAdminStatus = (status: DocumentDetail["status"]): "Pending" | "Approved" | "Rejected" => {
  if (status === "Approved" || status === "Verified") return "Approved";
  if (status === "Rejected") return "Rejected";
  return "Pending";
};

const toTableRow = (document: DocumentDetail): DocumentTableRow => [
  document.fileName,
  document.orderNumber,
  document.uploadedBy.toUpperCase(),
  document.uploadDate,
  document.size,
  toAdminStatus(document.status),
  document.id,
];

const documentPath = (id: string) => `/documents/${encodeURIComponent(id)}`;

export const documentsApi = {
  async getDocuments(): Promise<DocumentTableRow[]> {
    const documents = await request<DocumentDetail[]>("/documents?shape=detail");
    return documents.map(toTableRow);
  },

  deleteDocument(id: string): Promise<boolean> {
    return request<Record<string, never>>(documentPath(id), { method: "DELETE" }).then(() => true);
  },

  async updateStatus(id: string, status: "Approved" | "Rejected"): Promise<DocumentTableRow> {
    const backendStatus = status === "Approved" ? "Approved" : "Rejected";
    const document = await request<DocumentDetail>(`${documentPath(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: backendStatus }),
    });
    return toTableRow(document);
  },

  async getDownloadUrl(id: string): Promise<string> {
    const result = await request<{ url: string }>(`${documentPath(id)}/download-url`);
    return result.url;
  },
};
