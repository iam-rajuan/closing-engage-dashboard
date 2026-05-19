import type { CompanyUser, NotaryUser, RegistrationRequest } from "../types";
import { adminAuth } from "./auth";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
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

export const usersApi = {
  async getCompanies(): Promise<CompanyUser[]> {
    return request<CompanyUser[]>("/users/companies");
  },

  async createCompany(company: Omit<CompanyUser, "id" | "initials" | "color" | "createdDate">): Promise<CompanyUser> {
    return request<CompanyUser>("/users/companies", {
      method: "POST",
      body: JSON.stringify(company),
    });
  },

  async updateCompany(id: string, updates: Partial<CompanyUser>): Promise<CompanyUser> {
    return request<CompanyUser>(`/users/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteCompany(id: string): Promise<boolean> {
    await request<Record<string, never>>(`/users/companies/${id}`, {
      method: "DELETE",
    });
    return true;
  },

  async getNotaries(): Promise<NotaryUser[]> {
    return request<NotaryUser[]>("/users/notaries");
  },

  async createNotary(notary: Omit<NotaryUser, "id" | "initials" | "color" | "createdDate">): Promise<NotaryUser> {
    return request<NotaryUser>("/users/notaries", {
      method: "POST",
      body: JSON.stringify(notary),
    });
  },

  async updateNotary(id: string, updates: Partial<NotaryUser>): Promise<NotaryUser> {
    return request<NotaryUser>(`/users/notaries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteNotary(id: string): Promise<boolean> {
    await request<Record<string, never>>(`/users/notaries/${id}`, {
      method: "DELETE",
    });
    return true;
  },

  async getAccessRequests(): Promise<RegistrationRequest[]> {
    return request<RegistrationRequest[]>("/access-requests");
  },

  async updateAccessRequestStatus(id: string, status: RegistrationRequest["status"]): Promise<RegistrationRequest> {
    return request<RegistrationRequest>(`/access-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
