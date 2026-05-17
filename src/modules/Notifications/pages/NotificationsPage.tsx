import { Bell, CheckCheck, CreditCard, MessageSquare, UserPlus } from "lucide-react";
import { useSWRConfig } from "swr";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Skeleton,
} from "@/modules/UI";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/modules/Common/utils/format";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationsService } from "../services/NotificationsService";
import type { AppNotification } from "../services/NotificationsService";

const ICON = {
  follower: UserPlus,
  message: MessageSquare,
  billing: CreditCard,
  system: Bell,
} as const;

export function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const { mutate } = useSWRConfig();
  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  async function markAll() {
    await NotificationsService.markAllRead();
    await mutate("/notifications");
  }
  async function markOne(id: string) {
    await NotificationsService.markRead(id);
    await mutate("/notifications");
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread`}
        actions={
          <Button
            variant="outline"
            leftIcon={<CheckCheck className="h-4 w-4" />}
            onClick={markAll}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        }
      />
      <Card>
        {isLoading && (
          <ul className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="p-4 flex gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && data?.length === 0 && (
          <EmptyState
            icon={<Bell className="h-5 w-5" />}
            title="No notifications"
            description="You're all caught up."
          />
        )}
        {!isLoading && data && data.length > 0 && (
          <ul className="divide-y divide-border">
            {data.map((n) => (
              <NotificationRow key={n.id} item={n} onRead={() => markOne(n.id)} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function NotificationRow({
  item,
  onRead,
}: {
  item: AppNotification;
  onRead: () => void;
}) {
  const Icon = ICON[item.type];
  return (
    <li
      className={cn(
        "p-4 flex gap-3 items-start",
        !item.read && "bg-accent/30",
      )}
    >
      <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <span className="text-[11px] text-muted-foreground shrink-0">
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
        {!item.read && (
          <div className="mt-2 flex items-center gap-2">
            <Badge tone="primary">New</Badge>
            <button
              onClick={onRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark as read
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
