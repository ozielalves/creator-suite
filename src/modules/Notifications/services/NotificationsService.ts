import { HttpClient } from "@/modules/Common/services/HttpClient";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type: "system" | "message" | "billing" | "follower";
}

class NotificationsServiceImpl {
  list() {
    return HttpClient.get<AppNotification[]>("/notifications");
  }
  markAllRead() {
    return HttpClient.post("/notifications/read-all");
  }
  markRead(id: string) {
    return HttpClient.post(`/notifications/${id}/read`);
  }
}
const notificationsService = new NotificationsServiceImpl();
export { notificationsService as NotificationsService };
