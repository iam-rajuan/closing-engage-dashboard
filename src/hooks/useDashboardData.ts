import { useCallback, useEffect, useState } from "react";
import type { MetricCard } from "../data";
import {
  fetchDashboardMetrics,
  fetchActiveUsersTrend,
  fetchNotifications,
  type ChartDataPoint,
  type NotificationItem,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/dashboardService";

interface DashboardState {
  metrics: MetricCard[];
  chartData: ChartDataPoint[];
  notifications: NotificationItem[];
  isLoading: boolean;
  isChartLoading: boolean;
  error: string | null;
}

const initialDashboardState: DashboardState = {
  metrics: [],
  chartData: [],
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
      const [metrics, chartData, notifications] = await Promise.all([
        fetchDashboardMetrics(),
        fetchActiveUsersTrend(chartPeriod),
        fetchNotifications(),
      ]);
      updateSharedDashboardState({ metrics, chartData, notifications, isLoading: false, isChartLoading: false, error: null });
    } catch (err) {
      updateSharedDashboardState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard data",
      }));
    }
  }, []);

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
        const chartData = await fetchActiveUsersTrend(chartPeriod);
        if (active) {
          updateSharedDashboardState((prev) => ({ ...prev, chartData, isChartLoading: false }));
        }
      } catch {
        if (active) {
          updateSharedDashboardState((prev) => ({ ...prev, isChartLoading: false }));
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

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return {
    ...state,
    chartPeriod,
    setChartPeriod,
    unreadCount,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    refetch: fetchAll,
  };
}
