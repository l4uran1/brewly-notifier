import { orderConfirmation, type Email, type OrderCreated } from "./email.ts";

export interface Mailer {
  send(email: Email): Promise<void>;
}

/**
 * Sends one confirmation per order. The queue is at-least-once, so the same event can
 * arrive twice: the order id is the idempotency key.
 */
export function orderCreatedHandler(mailer: Mailer, sent: Set<string> = new Set()) {
  return async (payload: unknown): Promise<void> => {
    const event = payload as OrderCreated;
    if (sent.has(event.orderId)) return;
    await mailer.send(orderConfirmation(event));
    sent.add(event.orderId);
  };
}
