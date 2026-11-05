import { FileQueueConsumer } from "./queue.ts";
import { orderCreatedHandler, type Mailer } from "./handler.ts";

const queueDir = process.env.BREWLY_QUEUE_DIR ?? "/tmp/brewly-queue";

// Prints instead of sending: this is a demo.
const consoleMailer: Mailer = {
  async send(email) {
    console.log(`\n✉️  To: ${email.to}\n   Subject: ${email.subject}\n\n${email.body.replace(/^/gm, "   ")}\n`);
  },
};

const consumer = new FileQueueConsumer(queueDir, "orders.created", "notifier");
const handle = orderCreatedHandler(consoleMailer);

console.log(`notifier consuming orders.created from ${queueDir}`);
setInterval(() => consumer.poll(handle).catch((err) => console.error("notifier:", err)), 500);
