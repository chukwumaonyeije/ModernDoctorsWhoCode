import { preview } from 'astro';

// Use Astro's pinned preview API so Playwright owns a foreground process even in agent environments.
const server = await preview({ server: { host: '127.0.0.1', port: 4321 } });
if (server.port !== 4321) {
  await server.stop();
  throw new Error('Browser checks require the dedicated localhost port 4321.');
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await server.stop(); process.exit(0); });
await server.closed();
