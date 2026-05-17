import useSWR from "swr";
import {
  SubscriptionService,
  type CurrentSubscription,
  type Invoice,
  type Plan,
} from "../services/SubscriptionService";

export const usePlans = () =>
  useSWR<Plan[]>("/subscription/plans", () => SubscriptionService.plans());
export const useCurrentSubscription = () =>
  useSWR<CurrentSubscription>("/subscription/current", () =>
    SubscriptionService.current(),
  );
export const useInvoices = () =>
  useSWR<Invoice[]>("/subscription/invoices", () => SubscriptionService.invoices());
