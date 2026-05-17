import type { LucideIcon } from "lucide-react";

export type PageKey =
  | "dashboard"
  | "usersCompanies"
  | "usersNotaries"
  | "companyDetails"
  | "notaryProfile"
  | "orders"
  | "orderDetails"
  | "documents"
  | "documentView"
  | "analytics"
  | "settings"
  | "notifications";

export type NavItem = {
  key: "dashboard" | "usersCompanies" | "orders" | "documents" | "analytics" | "settings";
  label: string;
  icon: LucideIcon;
};

export type StatusKey =
  | "Active"
  | "Pending"
  | "Inactive"
  | "Approved"
  | "Rejected"
  | "Assigned"
  | "Received"
  | "Completed"
  | "In Progress"
  | "Verified"
  | "Pending Review"
  | "Under Review";

export interface CompanyUser {
  id: string; // e.g., "COMP-1"
  initials: string;
  color: string;
  companyName: string;
  contactPerson: string;
  businessEmail: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
  createdDate: string;
  address?: string;
  contactEmail?: string;
  userName?: string;
  password?: string;
  sendInvite?: boolean;
  verify?: boolean;
}

export interface NotaryUser {
  id: string; // e.g., "NOT-1"
  initials: string;
  color: string;
  fullName: string;
  specialty: string;
  email: string;
  phone: string;
  license: string;
  status: "Active" | "Inactive" | "Pending";
  createdDate: string;
  expiry?: string;
  serviceArea?: string;
  userName?: string;
  password?: string;
  sendInvite?: boolean;
  verify?: boolean;
}


