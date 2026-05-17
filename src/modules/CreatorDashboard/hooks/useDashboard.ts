import useSWR from "swr";
import {
  DashboardService,
  type ActivityItem,
  type DashboardStats,
  type RevenuePoint,
} from "../services/DashboardService";

/**
 * Server-state hooks stay lightweight; all logic lives in the service.
 * The SWR key doubles as both cache key and HttpClient URL.
 */
export const useDashboardStats = () =>
  useSWR<DashboardStats>("/dashboard/stats", () => DashboardService.getStats());

export const useRevenueSeries = () =>
  useSWR<RevenuePoint[]>("/dashboard/revenue", () => DashboardService.getRevenue());

export const useRecentActivity = () =>
  useSWR<ActivityItem[]>("/dashboard/activity", () => DashboardService.getActivity());
