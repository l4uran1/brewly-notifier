/** Payload of `orders.created`, as published by orders-api (see docs/system-map.md). */
export type OrderCreated = {
  orderId: string;
  customerEmail: string;
  totalCents: number;
  createdAt: string;
};

export type Email = {
  to: string;
  subject: string;
  body: string;
};

export function formatMoney(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
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
      `Total: ${formatMoney(event.totalCents)}`,
      "",
      "We'll let you know when your coffee is on its way.",
    ].join("\n"),
  };
}
