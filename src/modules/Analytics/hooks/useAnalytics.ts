import useSWR from "swr";
import { AnalyticsService, type AnalyticsOverview } from "../services/AnalyticsService";

export const useAnalyticsOverview = () =>
  useSWR<AnalyticsOverview>("/analytics/overview", () => AnalyticsService.overview());
