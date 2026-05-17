import { HttpClient } from "@/modules/Common/services/HttpClient";

export type AnalyticsOverview = {
  series: { day: string; views: number; signups: number }[];
  topSources: { source: string; visits: number }[];
};

class AnalyticsServiceImpl {
  overview() {
    return HttpClient.get<AnalyticsOverview>("/analytics/overview");
  }
}
const analyticsService = new AnalyticsServiceImpl();
export { analyticsService as AnalyticsService };
