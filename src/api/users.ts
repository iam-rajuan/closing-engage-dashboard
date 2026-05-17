import type { CompanyUser, NotaryUser } from "../types";
import { companyRows, notaryRows } from "../data";

// Helper to simulate network latency
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Local state caches inside the simulation layer
let companiesCache: CompanyUser[] = [...companyRows];
let notariesCache: NotaryUser[] = [...notaryRows];

export const usersApi = {
  // --- TITLE COMPANIES CLIENT API ---
  async getCompanies(): Promise<CompanyUser[]> {
    await delay(350);
    return [...companiesCache];
  },

  async createCompany(company: Omit<CompanyUser, "id" | "initials" | "color" | "createdDate">): Promise<CompanyUser> {
    await delay(600);
    const newCompany: CompanyUser = {
      ...company,
      id: `COMP-${Date.now()}`,
      initials: company.companyName.slice(0, 2).toUpperCase(),
      color: "bg-[#DCE7FF] text-[#3165CF]",
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    companiesCache = [newCompany, ...companiesCache];
    return newCompany;
  },

  async updateCompany(id: string, updates: Partial<CompanyUser>): Promise<CompanyUser> {
    await delay(500);
    const index = companiesCache.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Company user not found");

    const updated = {
      ...companiesCache[index],
      ...updates,
      initials: updates.companyName ? updates.companyName.slice(0, 2).toUpperCase() : companiesCache[index].initials,
    };
    companiesCache[index] = updated;
    return updated;
  },

  async deleteCompany(id: string): Promise<boolean> {
    await delay(400);
    companiesCache = companiesCache.filter((c) => c.id !== id);
    return true;
  },

  // --- NOTARIES CLIENT API ---
  async getNotaries(): Promise<NotaryUser[]> {
    await delay(350);
    return [...notariesCache];
  },

  async createNotary(notary: Omit<NotaryUser, "id" | "initials" | "color" | "createdDate">): Promise<NotaryUser> {
    await delay(600);
    const newNotary: NotaryUser = {
      ...notary,
      id: `NOT-${Date.now()}`,
      initials: notary.fullName.slice(0, 2).toUpperCase(),
      color: "bg-[#FFE2D3] text-[#C66B33]",
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    notariesCache = [newNotary, ...notariesCache];
    return newNotary;
  },

  async updateNotary(id: string, updates: Partial<NotaryUser>): Promise<NotaryUser> {
    await delay(500);
    const index = notariesCache.findIndex((n) => n.id === id);
    if (index === -1) throw new Error("Notary user not found");

    const updated = {
      ...notariesCache[index],
      ...updates,
      initials: updates.fullName ? updates.fullName.slice(0, 2).toUpperCase() : notariesCache[index].initials,
    };
    notariesCache[index] = updated;
    return updated;
  },

  async deleteNotary(id: string): Promise<boolean> {
    await delay(400);
    notariesCache = notariesCache.filter((n) => n.id !== id);
    return true;
  },
};
