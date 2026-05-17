import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  PageHeader,
  Skeleton,
} from "@/modules/UI";
import { formatNumber } from "@/modules/Common/utils/format";
import { useAnalyticsOverview } from "../hooks/useAnalytics";

export function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsOverview();
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Audience growth and content performance"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic</CardTitle>
            <CardDescription>Views and signups, last 14 days</CardDescription>
          </CardHeader>
          <div className="p-5 pt-2 h-[300px]">
            {isLoading || !data ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.series} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="signups" stroke="var(--success)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <div className="p-5 pt-2 h-[300px]">
            {isLoading || !data ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topSources} layout="vertical" margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="source" stroke="var(--muted-foreground)" fontSize={11} width={90} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [formatNumber(Number(v)), "Visits"]}
                  />
                  <Bar dataKey="visits" fill="var(--primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
