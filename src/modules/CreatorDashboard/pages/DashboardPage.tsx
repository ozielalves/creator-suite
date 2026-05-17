import { PageHeader, Button } from "@/modules/UI";
import { Plus } from "lucide-react";
import { StatsCards } from "../components/StatsCards";
import { RevenueChart } from "../components/RevenueChart";
import { ActivityFeed } from "../components/ActivityFeed";

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your creator business at a glance."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>New post</Button>
        }
      />
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
