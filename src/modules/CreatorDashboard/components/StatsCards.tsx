import { DollarSign, Users, FileText, Activity } from "lucide-react";
import { Stat } from "@/modules/UI";
import { formatCurrency, formatNumber } from "@/modules/Common/utils/format";
import { useDashboardStats } from "../hooks/useDashboard";

export function StatsCards() {
  const { data, isLoading } = useDashboardStats();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Stat
        label="Revenue"
        value={data ? formatCurrency(data.revenueCents) : "—"}
        delta={data?.revenueDelta}
        icon={<DollarSign className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <Stat
        label="Subscribers"
        value={data ? formatNumber(data.subscribers) : "—"}
        delta={data?.subscribersDelta}
        icon={<Users className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <Stat
        label="Posts"
        value={data ? formatNumber(data.posts) : "—"}
        delta={data?.postsDelta}
        icon={<FileText className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <Stat
        label="Engagement"
        value={data ? `${data.engagement}%` : "—"}
        delta={data?.engagementDelta}
        icon={<Activity className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  );
}
