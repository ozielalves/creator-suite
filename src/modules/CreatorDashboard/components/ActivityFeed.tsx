import { Card, CardHeader, CardTitle, CardDescription, Avatar, Skeleton } from "@/modules/UI";
import { formatRelativeTime } from "@/modules/Common/utils/format";
import { useRecentActivity } from "../hooks/useDashboard";

export function ActivityFeed() {
  const { data, isLoading } = useRecentActivity();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Live feed of subscriber actions</CardDescription>
      </CardHeader>
      <ul className="divide-y divide-border">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 p-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </li>
        ))}
        {data?.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-4">
            <Avatar name={item.actor} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-foreground">{item.actor}</span>{" "}
                <span className="text-muted-foreground">{item.action}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatRelativeTime(item.at)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
