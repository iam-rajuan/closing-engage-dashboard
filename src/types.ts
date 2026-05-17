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

