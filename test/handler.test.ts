import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { orderCreatedHandler } from "../src/handler.ts";
import { FileQueueConsumer } from "../src/queue.ts";
import type { Email } from "../src/email.ts";

const event = { orderId: "o-1", customerEmail: "ana@example.com", totalCents: 2500, createdAt: "2026-11-05T10:00:00.000Z" };

function recordingMailer() {
  const sent: Email[] = [];
  return { sent, send: async (email: Email) => void sent.push(email) };
}

test("sends one confirmation per order, even if the event is delivered twice", async () => {
  const mailer = recordingMailer();
  const handle = orderCreatedHandler(mailer);

  await handle(event);
  await handle(event);

  assert.equal(mailer.sent.length, 1);
});

test("the consumer only handles new messages on each poll", async () => {
  const dir = mkdtempSync(join(tmpdir(), "notifier-"));
  const consumer = new FileQueueConsumer(dir, "orders.created", "notifier");
  const mailer = recordingMailer();
  const handle = orderCreatedHandler(mailer);

  appendFileSync(join(dir, "orders.created.jsonl"), JSON.stringify(event) + "\n");
  assert.equal(await consumer.poll(handle), 1);
  assert.equal(await consumer.poll(handle), 0);

  appendFileSync(join(dir, "orders.created.jsonl"), JSON.stringify({ ...event, orderId: "o-2" }) + "\n");
  assert.equal(await consumer.poll(handle), 1);
  assert.deepEqual(mailer.sent.map((e) => e.to), ["ana@example.com", "ana@example.com"]);
});
