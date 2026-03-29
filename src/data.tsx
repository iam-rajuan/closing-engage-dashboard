import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileCog,
  FileText,
  FolderOpen,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  Users,
} from "lucide-react";
import type { NavItem, PageKey } from "./types";

export const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "usersCompanies", label: "Users Management", icon: Users },
  { key: "orders", label: "Orders Management", icon: ShoppingCart },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "analytics", label: "Analytics", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings },
];

export const pageGroups: Record<PageKey, NavItem["key"]> = {
  dashboard: "dashboard",
  usersCompanies: "usersCompanies",
  usersNotaries: "usersCompanies",
  companyDetails: "usersCompanies",
  notaryProfile: "usersCompanies",
  orders: "orders",
  orderDetails: "orders",
  documents: "documents",
  documentView: "documents",
  analytics: "analytics",
  settings: "settings",
};

export type MetricCard = {
  title: string;
  value: string;
  note?: string;
  tone?: "blue" | "green" | "amber" | "slate";
  icon: LucideIcon;
};

export const dashboardMetrics: MetricCard[] = [
  { title: "Total Title Companies", value: "142", note: "+12%", tone: "blue", icon: Building2 },
  { title: "Total Notaries", value: "1,208", note: "+4%", tone: "blue", icon: UserCog },
  { title: "Total Orders", value: "8,492", tone: "slate", icon: ClipboardList },
  { title: "Orders Pending Approval", value: "28", note: "Alert", tone: "amber", icon: FileCog },
  { title: "Completed Orders", value: "7,814", note: "92%", tone: "green", icon: CheckCircle2 },
];

export const analyticsMetrics: MetricCard[] = [
  { title: "Total Orders", value: "2,482", note: "+12%", tone: "blue", icon: ClipboardList },
  { title: "Completed", value: "1,845", tone: "blue", icon: CheckCircle2 },
  { title: "Pending Orders", value: "485", tone: "amber", icon: FolderOpen },
  { title: "Active Notaries", value: "124", tone: "slate", icon: UserCog },
  { title: "Title Companies", value: "86", tone: "slate", icon: Building2 },
];

export const companyRows = [
  ["ST", "bg-[#DCE7FF] text-[#3165CF]", "Summit Title", "Jane Smith", "jane.smith@summittitle.com", "(555) 123-4567", "Active", "Feb 28, 2026"],
  ["BA", "bg-[#FFE2D3] text-[#C66B33]", "Blue Anchor LLC", "Robert Chen", "r.chen@blueanchor.io", "(555) 987-6543", "Pending", "Feb 28, 2026"],
  ["ET", "bg-[#E9EEF6] text-[#69778E]", "Elite Trust", "Amanda Waller", "awaller@elitetrust.com", "(555) 444-3322", "Inactive", "Feb 28, 2026"],
  ["HS", "bg-[#DCE7FF] text-[#3165CF]", "Horizon Settlements", "Michael Scott", "m.scott@horizonsettle.com", "(555) 888-9900", "Active", "Feb 28, 2026"],
] as const;

export const notaryRows = [
  ["SH", "bg-[#DCE7FF] text-[#3165CF]", "Sarah Harrison", "Residential Specialist", "s.harrison@legalmail.com", "(555) 124-5567", "NY-882910", "Active", "Oct 12, 2023"],
  ["JM", "bg-[#FFE2D3] text-[#C66B33]", "James Miller", "Commercial Notary", "j.miller@proclosing.net", "(555) 901-2234", "TX-445012", "Pending", "Dec 01, 2023"],
  ["ML", "bg-[#E9EEF6] text-[#69778E]", "Maria Lopez", "Bilingual / Escrow", "m.lopez@globale.com", "(555) 345-1289", "FL-110293", "Inactive", "Aug 22, 2023"],
  ["DK", "bg-[#DCE7FF] text-[#3165CF]", "David Kim", "Title Agent", "d.kim@proclosing.net", "(555) 778-4432", "CA-909281", "Active", "Nov 15, 2023"],
] as const;

export const orderRows = [
  ["#ORD-90212", "Northway Holdings", "NH", "Jane Simmons", "123 Maple St\nAustin, TX", "Oct 24,\n2023", "Assigned", "jane"],
  ["#ORD-90208", "Acme Title Co.", "AT", "Unassigned", "456 Oak Ave\nDallas, TX", "Oct 22,\n2023", "Received", "none"],
  ["#ORD-88421", "Capital Escrow", "CE", "Mark Evans", "789 Pine Rd\nHouston, TX", "Oct 18,\n2023", "Completed", "mark"],
] as const;

export const documentRows = [
  ["Closing_Disclosure_Fina...", "#ORD-882190", "TITLE COMPANY", "Oct 24, 2023", "1.2 MB", "Approved"],
  ["Wire_Instructions_A-B.pdf", "#ORD-991022", "NOTARY", "Oct 23, 2023", "450 KB", "Pending"],
  ["Insurance_Binder_Proof....", "#ORD-771234", "BUYER", "Oct 22, 2023", "2.4 MB", "Rejected"],
  ["Title_Search_Report.pdf", "#ORD-881552", "TITLE COMPANY", "Oct 20, 2023", "3.1 MB", "Approved"],
] as const;

export const quickActions = [
  { title: "Add User", description: "Create new internal or partner accounts", icon: UserCog, tone: "blue" },
  { title: "Assign Orders", description: "Route pending files to available notaries", icon: ClipboardList, tone: "slate" },
  { title: "Approve Documents", description: "Verify and sign-off on 28 pending items", icon: ShieldCheck, tone: "amber" },
] as const;

export const teamMembers = [
  ["SM", "bg-[#DCE7FF] text-[#4259B2]", "Sarah J. Miller", "sarah.m@northway.com", "Senior Escrow Officer"],
  ["MC", "bg-[#DFE6FF] text-[#5B6AAE]", "Marcus Chen", "m.chen@northway.com", "Director of Operations"],
  ["ER", "bg-[#FFE1D2] text-[#C87846]", "Elena Rodriguez", "elena.r@northway.com", "Founder"],
] as const;

export const recentOrders = [
  ["#ORD-90212", "In Progress", "Mar 20, 2026"],
  ["#ORD-90208", "Approved", "Mar 15, 2026"],
  ["#ORD-88421", "Completed", "Feb 24, 2026"],
] as const;

export const assignedOrders = [
  ["#ORD-90212", "In Progress", "Oct 24, 2023"],
  ["#ORD-90208", "Approved", "Oct 22, 2023"],
  ["#ORD-88421", "Completed", "Oct 18, 2023"],
] as const;

export const uploadActivity = [
  ["Commission_Certificate.pdf", "Uploaded Sep 12, 2023"],
  ["Background_Check_2023.pdf", "Uploaded Aug 15, 2023"],
] as const;

export const orderTimeline = [
  ["Order created by System", "Oct 20, 2024 • 09:45 AM", "blue"],
  ["Notary John Doe assigned", "Oct 21, 2024 • 02:20 PM", "slate"],
  ["Documents uploaded by John Doe", "Oct 24, 2024 • 04:15 PM", "green"],
] as const;

export const documentTimeline = [
  ["File uploaded by Northway Holdings", "Oct 24, 10:15 AM", "blue"],
  ["Automated scan complete - No errors found", "Oct 24, 10:16 AM", "slate"],
  ["Assigned to Admin Review", "Oct 24, 10:20 AM", "slate"],
] as const;

export const assignableNotaries = [
  ["Sarah Jenkins", "Austin, TX • 4.9 Rating", "Active"],
  ["Marcus Thorne", "Round Rock, TX • 4.7 Rating", "Verified"],
  ["Elena Rodriguez", "Cedar Park, TX • 5.0 Rating", "Active"],
] as const;

export const stepItems = ["Received", "Assigned", "Under Review", "Approved", "Completed"] as const;

export const statusConfig = {
  Active: "bg-[#EEF9F0] text-[#2F9E54]",
  Pending: "bg-[#FFF4DB] text-[#C79016]",
  Inactive: "bg-[#E9EEF6] text-[#6A7280]",
  Approved: "bg-[#E8F8EA] text-[#2C9A4D]",
  Rejected: "bg-[#FDE8E7] text-[#D25753]",
  Assigned: "bg-[#DFEAFE] text-[#2E68CF]",
  Received: "bg-[#EDF1F6] text-[#7B8492]",
  Completed: "bg-[#DCF9E5] text-[#3DAE66]",
  "In Progress": "bg-[#E7EEFF] text-[#336DDA]",
  Verified: "bg-[#DFEAFE] text-[#2E68CF]",
  "Pending Review": "bg-[#FFE8D8] text-[#CE7E3B]",
  "Under Review": "bg-[#E7EEFF] text-[#336DDA]",
} as const;

export const profileGradients = {
  jane:
    "bg-[radial-gradient(circle_at_35%_30%,#f0d0bc_0_12%,transparent_13%),radial-gradient(circle_at_42%_34%,#3d2c30_0_11%,transparent_12%),radial-gradient(circle_at_55%_34%,#3d2c30_0_10%,transparent_11%),radial-gradient(circle_at_50%_70%,#d48c6e_0_19%,transparent_20%),linear-gradient(180deg,#9fd3ff_0%,#dfeeff_100%)]",
  alex:
    "bg-[radial-gradient(circle_at_48%_28%,#f2c6a9_0_9%,transparent_10%),radial-gradient(circle_at_47%_24%,#0f172a_0_17%,transparent_18%),radial-gradient(circle_at_50%_64%,#5973cf_0_20%,transparent_21%),linear-gradient(180deg,#0d172d_0%,#2c5eb8_100%)]",
  mark:
    "bg-[radial-gradient(circle_at_48%_28%,#f0c4a5_0_9%,transparent_10%),radial-gradient(circle_at_47%_24%,#211a1a_0_17%,transparent_18%),radial-gradient(circle_at_50%_64%,#253858_0_20%,transparent_21%),linear-gradient(180deg,#131a28_0%,#40598d_100%)]",
};
