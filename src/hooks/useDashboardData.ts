import { useCallback, useEffect, useState } from "react";
import type { MetricCard } from "../data";
import {
  createFallbackDashboardOverview,
  fetchDashboardOverview,
  fetchNotifications,
  normalizeDashboardOverview,
  type DashboardOverview,
  type ChartDataPoint,
  type QuickActionItem,
  type NotificationItem,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
  toMetricCards,
  toQuickActions,
} from "../api/dashboardService";

const DASHBOARD_CACHE_KEY = "dashboard_overview_cache";

const ensureMetricArray = (value: unknown): MetricCard[] => (Array.isArray(value) ? (value as MetricCard[]) : []);
const ensureChartArray = (value: unknown): ChartDataPoint[] => (Array.isArray(value) ? (value as ChartDataPoint[]) : []);
const ensureQuickActionArray = (value: unknown): QuickActionItem[] => (Array.isArray(value) ? (value as QuickActionItem[]) : []);
const ensureNotificationArray = (value: unknown): NotificationItem[] =>
  Array.isArray(value) ? (value as NotificationItem[]) : [];

const buildSnapshotFromOverview = (overview: DashboardOverview) => ({
  metrics: toMetricCards(overview),
  chartData: overview.activeUsersTrend,
  quickActions: toQuickActions(overview),
});

const readCachedDashboardOverview = (
  period: "7d" | "30d" | "90d" = "30d"
): DashboardOverview | null => {
  try {
    const saved = localStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return normalizeDashboardOverview(parsed, period);
  } catch {
    return null;
  }
};

const createFallbackSnapshot = (
  period: "7d" | "30d" | "90d" = "30d"
)=>
  buildSnapshotFromOverview(createFallbackDashboardOverview(period));

const persistDashboardOverview = (overview: DashboardOverview) => {
  try {
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(overview));
  } catch {
    // Ignore storage write failures and continue rendering.
  }
};

interface DashboardState {
  metrics: MetricCard[];
  chartData: ChartDataPoint[];
  quickActions: QuickActionItem[];
  notifications: NotificationItem[];
  isLoading: boolean;
  isChartLoading: boolean;
  error: string | null;
}

const cachedOverview = readCachedDashboardOverview("30d");
const initialSnapshot = cachedOverview
  ? buildSnapshotFromOverview(cachedOverview)
  : createFallbackSnapshot("30d");

const initialDashboardState: DashboardState = {
  metrics: ensureMetricArray(initialSnapshot.metrics),
  chartData: ensureChartArray(initialSnapshot.chartData),
  quickActions: ensureQuickActionArray(initialSnapshot.quickActions),
  notifications: [],
  isLoading: true,
  isChartLoading: false,
  error: null,
};

let sharedDashboardState: DashboardState = initialDashboardState;
const dashboardListeners = new Set<(state: DashboardState) => void>();

const updateSharedDashboardState = (
  updater: DashboardState | ((prev: DashboardState) => DashboardState)
) => {
  sharedDashboardState =
    typeof updater === "function" ? (updater as (prev: DashboardState) => DashboardState)(sharedDashboardState) : updater;

  dashboardListeners.forEach((listener) => listener(sharedDashboardState));
};

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>(sharedDashboardState);

  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    dashboardListeners.add(setState);
    return () => {
      dashboardListeners.delete(setState);
    };
  }, []);

  // Fetch all initial data once on mount
  const fetchAll = useCallback(async () => {
    updateSharedDashboardState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [overviewResult, notificationsResult] = await Promise.allSettled([
        fetchDashboardOverview(chartPeriod),
        fetchNotifications(),
      ]);

      const overview =
        overviewResult.status === "fulfilled"
          ? overviewResult.value
          : createFallbackDashboardOverview(chartPeriod);
      const snapshot = buildSnapshotFromOverview(overview);

      if (overviewResult.status === "fulfilled") {
        persistDashboardOverview(overview);
      }

      updateSharedDashboardState({
        metrics: ensureMetricArray(snapshot.metrics),
        chartData: ensureChartArray(snapshot.chartData),
        quickActions: ensureQuickActionArray(snapshot.quickActions),
        notifications: notificationsResult.status === "fulfilled" ? ensureNotificationArray(notificationsResult.value) : [],
        isLoading: false,
        isChartLoading: false,
        error:
          overviewResult.status === "rejected"
            ? overviewResult.reason instanceof Error
              ? overviewResult.reason.message
              : "Failed to load dashboard data"
            : null,
      });
    } catch {
      const fallbackSnapshot = buildSnapshotFromOverview(
        readCachedDashboardOverview(chartPeriod) ?? createFallbackDashboardOverview(chartPeriod)
      );
      updateSharedDashboardState((prev) => ({
        ...prev,
        metrics: ensureMetricArray(fallbackSnapshot.metrics),
        chartData: ensureChartArray(fallbackSnapshot.chartData),
        quickActions: ensureQuickActionArray(fallbackSnapshot.quickActions),
        notifications: [],
        isLoading: false,
        isChartLoading: false,
        error: "Failed to load dashboard data",
      }));
    }
  }, [chartPeriod]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Fetch chart data specifically when period changes (excluding initial load where fetchAll handles it)
  useEffect(() => {
    let active = true;

    // Skip if page is already doing a full mount load
    if (state.isLoading) return;

    const updateChart = async () => {
      updateSharedDashboardState((prev) => ({ ...prev, isChartLoading: true }));
      try {
        const overview = await fetchDashboardOverview(chartPeriod);
        const snapshot = buildSnapshotFromOverview(overview);
        persistDashboardOverview(overview);
        if (active) {
          updateSharedDashboardState((prev) => ({
            ...prev,
            metrics: ensureMetricArray(snapshot.metrics),
            chartData: ensureChartArray(snapshot.chartData),
            quickActions: ensureQuickActionArray(snapshot.quickActions),
            isChartLoading: false,
            error: null,
          }));
        }
      } catch {
        if (active) {
          const fallbackSnapshot = buildSnapshotFromOverview(
            readCachedDashboardOverview(chartPeriod) ?? createFallbackDashboardOverview(chartPeriod)
          );
          updateSharedDashboardState((prev) => ({
            ...prev,
            metrics: ensureMetricArray(fallbackSnapshot.metrics),
            chartData: ensureChartArray(fallbackSnapshot.chartData),
            quickActions: ensureQuickActionArray(fallbackSnapshot.quickActions),
            isChartLoading: false,
          }));
        }
      }
    };

    updateChart();

    return () => {
      active = false;
    };
  }, [chartPeriod]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    updateSharedDashboardState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    updateSharedDashboardState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
    updateSharedDashboardState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  };

  const handleClearAllNotifications = async () => {
    await clearAllNotifications();
    updateSharedDashboardState((prev) => ({
      ...prev,
      notifications: [],
    }));
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return {
    ...state,
    metrics: ensureMetricArray(state.metrics),
    chartData: ensureChartArray(state.chartData),
    quickActions: ensureQuickActionArray(state.quickActions),
    notifications: ensureNotificationArray(state.notifications),
    chartPeriod,
    setChartPeriod,
    unreadCount,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    removeNotification: handleDeleteNotification,
    clearNotifications: handleClearAllNotifications,
    refetch: fetchAll,
  };
}
