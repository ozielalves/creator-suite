import { Check } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  PageHeader,
  Skeleton,
} from "@/modules/UI";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/modules/Common/utils/format";
import {
  useCurrentSubscription,
  useInvoices,
  usePlans,
} from "../hooks/useSubscription";

export function SubscriptionPage() {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: current } = useCurrentSubscription();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  return (
    <div>
      <PageHeader
        title="Subscription"
        description="Manage your plan and billing"
      />

      <section aria-labelledby="plans-heading" className="mb-10">
        <h2 id="plans-heading" className="sr-only">
          Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plansLoading && Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
          {plans?.map((p) => {
            const isCurrent = p.id === current?.planId;
            const highlighted = p.id === "pro";
            return (
              <Card
                key={p.id}
                className={cn(
                  "p-6 flex flex-col",
                  highlighted && "ring-2 ring-primary",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{p.name}</h3>
                  {isCurrent && <Badge tone="success">Current</Badge>}
                  {!isCurrent && highlighted && <Badge tone="primary">Popular</Badge>}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">
                    {formatCurrency(p.priceCents)}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-5 space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6"
                  variant={isCurrent ? "outline" : highlighted ? "primary" : "secondary"}
                  fullWidth
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current plan" : "Upgrade"}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="billing-heading">
        <Card>
          <CardHeader>
            <CardTitle id="billing-heading">Billing history</CardTitle>
            <CardDescription>Recent invoices</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Invoice</th>
                  <th className="px-5 py-2 font-medium">Date</th>
                  <th className="px-5 py-2 font-medium">Amount</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoicesLoading && Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
                {invoices?.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-5 py-3 font-medium">{inv.id}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">{formatCurrency(inv.amountCents)}</td>
                    <td className="px-5 py-3">
                      <Badge
                        tone={
                          inv.status === "paid"
                            ? "success"
                            : inv.status === "due"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
