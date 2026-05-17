import { HttpClient } from "@/modules/Common/services/HttpClient";

export interface DashboardStats {
  revenueCents: number;
  revenueDelta: number;
  subscribers: number;
  subscribersDelta: number;
  posts: number;
  postsDelta: number;
  engagement: number;
  engagementDelta: number;
}
export interface RevenuePoint {
  month: string;
  revenue: number;
}
export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  at: string;
}

class DashboardServiceImpl {
  getStats() {
    return HttpClient.get<DashboardStats>("/dashboard/stats");
  }
  getRevenue() {
    return HttpClient.get<RevenuePoint[]>("/dashboard/revenue");
  }
  getActivity() {
    return HttpClient.get<ActivityItem[]>("/dashboard/activity");
  }
}
const dashboardService = new DashboardServiceImpl();
export { dashboardService as DashboardService };
