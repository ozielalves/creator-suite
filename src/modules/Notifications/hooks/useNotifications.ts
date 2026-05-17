import useSWR from "swr";
import {
  NotificationsService,
  type AppNotification,
} from "../services/NotificationsService";

export const useNotifications = () =>
  useSWR<AppNotification[]>("/notifications", () => NotificationsService.list());
