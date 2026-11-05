import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMoney, orderConfirmation } from "../src/email.ts";

const event = {
  orderId: "3f2a9c1e-0000-4000-8000-000000000000",
  customerEmail: "ana@example.com",
  totalCents: 2999,
  createdAt: "2026-11-05T10:00:00.000Z",
};

test("formatMoney formats cents as euros", () => {
  assert.equal(formatMoney(2999), "€29.99");
  assert.equal(formatMoney(500), "€5.00");
});

test("orderConfirmation is addressed to the customer with the short order id", () => {
  const email = orderConfirmation(event);
  assert.equal(email.to, "ana@example.com");
  assert.equal(email.subject, "Your Brewly order 3f2a9c1e is confirmed");
});

test("orderConfirmation shows the order total", () => {
  assert.match(orderConfirmation(event).body, /Total: €29\.99/);
});
