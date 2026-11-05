# notifier

This repo is part of the Brewly ecosystem. The shared rules, the system map and the
specs live in ../AGENTS.md, ../docs/ and ../openspec/. Start the agent from the ecosystem
root, not from inside this repo.

Consumes `orders.created` and sends the order confirmation email. It does not own the
event: its shape is defined by orders-api (see ../docs/system-map.md).

## Commands

- Install: `npm install` (only needed for lint; tests run with plain Node 22)
- Tests: `npm test` (single test: `node --test test/email.test.ts`)
- Lint: `npm run lint` (type check with `tsc --noEmit`)
- Build: none: Node runs the TypeScript sources directly
- Run: `npm start` (prints emails instead of sending them; `BREWLY_QUEUE_DIR` sets the queue folder)

## Conventions

- No runtime dependencies. Only erasable TypeScript; relative imports end in `.ts`.
- Handlers must be idempotent: the queue delivers at least once.
- Money arrives as an integer number of cents.

## Do not touch without asking

- `src/queue.ts`: the offset format is shared with the other consumers' local setup.
