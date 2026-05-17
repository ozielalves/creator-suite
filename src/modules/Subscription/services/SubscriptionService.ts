import { HttpClient } from "@/modules/Common/services/HttpClient";

export interface Plan {
  id: "free" | "pro" | "studio";
  name: string;
  priceCents: number;
  features: string[];
}
export interface CurrentSubscription {
  planId: Plan["id"];
  renewsAt: string;
  status: "active" | "past_due" | "canceled";
}
export interface Invoice {
  id: string;
  amountCents: number;
  status: "paid" | "due" | "failed";
  issuedAt: string;
}

class SubscriptionServiceImpl {
  plans() {
    return HttpClient.get<Plan[]>("/subscription/plans");
  }
  current() {
    return HttpClient.get<CurrentSubscription>("/subscription/current");
  }
  invoices() {
    return HttpClient.get<Invoice[]>("/subscription/invoices");
  }
}
const subscriptionService = new SubscriptionServiceImpl();
export { subscriptionService as SubscriptionService };
