export type Currency = "EUR" | "GBP";

/** Payload of `orders.created`, as published by orders-api (see docs/system-map.md). */
export type OrderCreated = {
  orderId: string;
  customerEmail: string;
  /** Minor units of `currency`, VAT included. */
  totalCents: number;
  /** Missing in events published before add-order-currency: treat as EUR. */
  currency?: Currency;
  /** EUR per one unit of `currency`. Not used by notifier. */
  eurExchangeRate?: number;
  createdAt: string;
};

export type Email = {
  to: string;
  subject: string;
  body: string;
};

const SYMBOLS: Record<Currency, string> = { EUR: "€", GBP: "£" };

export function formatMoney(cents: number, currency: Currency): string {
  return `${SYMBOLS[currency]}${(cents / 100).toFixed(2)}`;
}

export function orderConfirmation(event: OrderCreated): Email {
  const shortId = event.orderId.slice(0, 8);
  return {
    to: event.customerEmail,
    subject: `Your Brewly order ${shortId} is confirmed`,
    body: [
      "Thanks for your order!",
      "",
      `Order: ${shortId}`,
      `Total: ${formatMoney(event.totalCents, "EUR")}`,
      "",
      "We'll let you know when your coffee is on its way.",
    ].join("\n"),
  };
}
