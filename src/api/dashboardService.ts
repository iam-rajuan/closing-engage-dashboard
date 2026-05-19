/**
 * Dashboard API Service Layer
 * 
 * All functions return mock data with simulated network latency.
 * To connect to a real backend, replace the function bodies with
 * actual fetch/axios calls — the signatures and return types stay the same.
 */

import {
  dashboardMetrics,
  quickActions,
} from "../data";
import type { MetricCard } from "../data";
import { adminAuth } from "./auth";

// ── Types ──────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "document" | "user" | "system";
}

export interface QuickActionItem {
  title: string;
  description: string;
  icon: any;
  tone: string;
}

export interface DashboardData {
  metrics: MetricCard[];
  chartData: ChartDataPoint[];
  notifications: NotificationItem[];
  quickActions: QuickActionItem[];
}

// ── Helpers ────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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

// ── Mock Data ──────────────────────────────────────────────────────

const mockChartData: ChartDataPoint[] = [
  { label: "Week 1", value: 820 },
  { label: "Week 2", value: 940 },
  { label: "Week 3", value: 1120 },
  { label: "Week 4", value: 1240 },
  { label: "Week 5", value: 1080 },
  { label: "Week 6", value: 960 },
  { label: "Week 7", value: 1150 },
  { label: "Week 8", value: 1340 },
];

const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New Order Received",
    message: "Order #ORD-90215 from Summit Title needs assignment.",
    time: "2 min ago",
    read: false,
    type: "order",
  },
  {
    id: "n2",
    title: "Document Approved",
    message: "Closing_Disclosure_Final.pdf has been approved.",
    time: "15 min ago",
    read: false,
    type: "document",
  },
  {
    id: "n3",
    title: "Notary Verified",
    message: "Sarah Harrison's credentials have been verified.",
    time: "1 hour ago",
    read: true,
    type: "user",
  },
  {
    id: "n4",
    title: "System Maintenance",
    message: "Scheduled maintenance window: Sat 2:00 AM - 4:00 AM EST.",
    time: "3 hours ago",
    read: true,
    type: "system",
  },
  {
    id: "n5",
    title: "28 Documents Pending",
    message: "Documents are awaiting your review and approval.",
    time: "5 hours ago",
    read: true,
    type: "document",
  },
];

// ── API Functions ──────────────────────────────────────────────────

/**
 * Fetch all dashboard metrics (KPI cards)
 * Replace body with: const res = await fetch('/api/dashboard/metrics'); return res.json();
 */
export async function fetchDashboardMetrics(): Promise<MetricCard[]> {
  await delay(600);
  return [...dashboardMetrics];
}

/**
 * Fetch active users trend chart data
 * Replace body with: const res = await fetch('/api/dashboard/chart?period=30d'); return res.json();
 */
export async function fetchActiveUsersTrend(
  _period: "7d" | "30d" | "90d" = "30d"
): Promise<ChartDataPoint[]> {
  await delay(800);
  return [...mockChartData];
}

/**
 * Fetch admin notifications
 * Replace body with: const res = await fetch('/api/notifications'); return res.json();
 */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    return await request<NotificationItem[]>("/notifications");
  } catch {
    return [...mockNotifications];
  }
}

/**
 * Mark a notification as read
 * Replace body with: await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
 */
export async function markNotificationRead(id: string): Promise<void> {
  await request<NotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<void> {
  await request<Record<string, never>>("/notifications/read-all", { method: "PATCH" });
}

/**
 * Fetch quick action items
 * Replace body with: const res = await fetch('/api/dashboard/quick-actions'); return res.json();
 */
export async function fetchQuickActions(): Promise<readonly QuickActionItem[]> {
  await delay(300);
  return [...quickActions];
}

/**
 * Export dashboard report (simulated CSV/PDF generation)
 * Replace body with: const res = await fetch('/api/reports/dashboard', { method: 'POST' }); return res.blob();
 */
export async function exportDashboardReport(
  _format: "csv" | "pdf" = "pdf"
): Promise<{ success: boolean; fileName: string }> {
  await delay(1800);
  return {
    success: true,
    fileName: `Dashboard_Report_${new Date().toISOString().slice(0, 10)}.${_format}`,
  };
}

/**
 * Global search across orders, notaries, documents
 * Replace body with: const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`); return res.json();
 */
export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "order" | "notary" | "document" | "company";
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  await delay(300);

  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search orders
  const orders = [
    { id: "#ORD-90212", company: "Northway Holdings", notary: "Jane Simmons" },
    { id: "#ORD-90208", company: "Acme Title Co.", notary: "Unassigned" },
    { id: "#ORD-88421", company: "Capital Escrow", notary: "Mark Evans" },
  ];
  orders.forEach((o) => {
    if (`${o.id} ${o.company} ${o.notary}`.toLowerCase().includes(q)) {
      results.push({
        id: o.id,
        title: o.id,
        subtitle: `${o.company} · ${o.notary}`,
        type: "order",
      });
    }
  });

  // Search notaries
  const notaries = [
    { id: "n1", name: "Sarah Harrison", spec: "Residential Specialist" },
    { id: "n2", name: "James Miller", spec: "Commercial Notary" },
    { id: "n3", name: "Maria Lopez", spec: "Bilingual / Escrow" },
    { id: "n4", name: "David Kim", spec: "Title Agent" },
  ];
  notaries.forEach((n) => {
    if (`${n.name} ${n.spec}`.toLowerCase().includes(q)) {
      results.push({
        id: n.id,
        title: n.name,
        subtitle: n.spec,
        type: "notary",
      });
    }
  });

  // Search companies
  const companies = [
    { id: "c1", name: "Summit Title", contact: "Jane Smith" },
    { id: "c2", name: "Blue Anchor LLC", contact: "Robert Chen" },
    { id: "c3", name: "Elite Trust", contact: "Amanda Waller" },
    { id: "c4", name: "Horizon Settlements", contact: "Michael Scott" },
  ];
  companies.forEach((c) => {
    if (`${c.name} ${c.contact}`.toLowerCase().includes(q)) {
      results.push({
        id: c.id,
        title: c.name,
        subtitle: c.contact,
        type: "company",
      });
    }
  });

  // Search documents
  const docs = [
    { id: "d1", name: "Closing_Disclosure_Final.pdf", order: "#ORD-882190" },
    { id: "d2", name: "Wire_Instructions_A-B.pdf", order: "#ORD-991022" },
    { id: "d3", name: "Insurance_Binder_Proof.pdf", order: "#ORD-771234" },
    { id: "d4", name: "Title_Search_Report.pdf", order: "#ORD-881552" },
  ];
  docs.forEach((d) => {
    if (`${d.name} ${d.order}`.toLowerCase().includes(q)) {
      results.push({
        id: d.id,
        title: d.name,
        subtitle: `Order: ${d.order}`,
        type: "document",
      });
    }
  });

  return results.slice(0, 8);
}
