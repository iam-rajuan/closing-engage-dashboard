import { adminAuth } from "./auth";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type DocumentTableRow = [string, string, string, string, string, "Pending" | "Approved" | "Rejected", string];

export interface DocumentDetail {
  id: string;
  fileName: string;
  orderNumber: string;
  uploadedBy: string;
  uploadDate: string;
  uploadedAt?: string;
  size: string;
  displayStatus: "Pending" | "Approved" | "Submitted" | "Verified" | "Rejected";
  status: "Pending Review" | "Approved" | "Rejected" | "Submitted" | "Pending" | "Verified";
  uploaderRole: "admin" | "company" | "notary" | "buyer" | "title-company";
  mimeType?: string;
  comments?: string;
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

const requestBinary = async <T>(path: string, file: File): Promise<T> => {
  const token = adminAuth.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: file,
  });

  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "File upload failed");
  }

  return result.data;
};

const requestFileObjectUrl = async (path: string): Promise<string> => {
  const token = adminAuth.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    throw new Error(result?.message || "Document file could not be loaded");
  }

  return URL.createObjectURL(await response.blob());
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

  async getDocumentDetails(): Promise<DocumentDetail[]> {
    return request<DocumentDetail[]>("/documents?shape=detail");
  },

  deleteDocument(id: string): Promise<boolean> {
    return request<Record<string, never>>(documentPath(id), { method: "DELETE" }).then(() => true);
  },

  async updateStatus(id: string, status: "Approved" | "Rejected", comments?: string): Promise<DocumentTableRow> {
    const backendStatus = status === "Approved" ? "Approved" : "Rejected";
    const document = await request<DocumentDetail>(`${documentPath(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: backendStatus, comments }),
    });
    return toTableRow(document);
  },

  async updateStatusDetail(id: string, status: "Approved" | "Rejected", comments?: string): Promise<DocumentDetail> {
    const backendStatus = status === "Approved" ? "Approved" : "Rejected";
    return request<DocumentDetail>(`${documentPath(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: backendStatus, comments }),
    });
  },

  async uploadDocument(orderNumber: string, file: File): Promise<DocumentDetail> {
    const query = new URLSearchParams({
      orderNumber,
      fileName: file.name,
      fileSize: String(file.size),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      mimeType: file.type || "application/octet-stream",
      status: "Submitted",
    });

    return requestBinary<DocumentDetail>(`/documents/upload?${query.toString()}`, file);
  },

  async getDownloadUrl(id: string): Promise<string> {
    return requestFileObjectUrl(`${documentPath(id)}/content?mode=download`);
  },

  async getPreviewUrl(id: string): Promise<string> {
    return requestFileObjectUrl(`${documentPath(id)}/content?mode=preview`);
  },
};
