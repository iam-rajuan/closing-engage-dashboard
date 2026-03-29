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
  | "settings";

export type NavItem = {
  key: "dashboard" | "usersCompanies" | "orders" | "documents" | "analytics" | "settings";
  label: string;
  icon: LucideIcon;
};
