// Does the dev server's MCP endpoint still report the blocking route when the browser check is lost?
import { spawn, execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 3492;
const URL = `http://localhost:${PORT}/`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function call(name, args = {}) {
  const res = await fetch(`${URL}_next/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  });
  const raw = await res.text();
  const json = raw.startsWith('{') ? raw : (raw.split('\n').find(l => l.startsWith('data:')) ?? '').slice(5);
  try {
    return JSON.parse(json).result?.content?.map(c => c.text).join('\n') ?? raw;
  } catch {
    return `HTTP ${res.status}: ${raw.slice(0, 200)}`;
  }
}
const BLOCKING = /blocking-prerender|outside of `?<Suspense>|uncached data/i;

async function scenario(name, visit) {
  rmSync('.next', { recursive: true, force: true });
  const dev = spawn('npx', ['next', 'dev', '-p', String(PORT)], { env: { ...process.env, NO_COLOR: '1' }, detached: true });
  let log = '';
  dev.stdout.on('data', d => (log += d));
  dev.stderr.on('data', d => (log += d));
  for (let i = 0; i < 120 && !/Ready in/.test(log); i++) await sleep(250);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await visit(page);
    await sleep(2500);
    const out = {};
    for (const [tool, args] of [['get_errors', {}], ['get_compilation_issues', {}], ['compile_route', { path: '/' }]]) out[tool] = await call(tool, args);
    console.log(`\n== ${name}`);
    console.log(`   terminal shows the blocking-route error: ${BLOCKING.test(log) ? 'YES' : 'no'}`);
    for (const [tool, text] of Object.entries(out)) console.log(`   ${tool}: ${BLOCKING.test(text) ? 'REPORTS the blocking route' : 'does not report it'} — ${String(text).replace(/\s+/g, ' ').slice(0, process.env.VERBOSE ? 700 : 150)}`);
  } finally {
    await browser.close();
    try { process.kill(-dev.pid, 'SIGKILL'); } catch {}
    await sleep(500);
  }
}

await scenario('no visit at all', async () => {});
await scenario('curl only', async () => void execFileSync('curl', ['-s', '-o', '/dev/null', URL]));
await scenario('Playwright, plain goto, page left open', page => page.goto(URL, { waitUntil: 'networkidle' }));
await scenario('Playwright with a route() registered, page left open', async page => {
  await page.route('**/never-matches/**', r => r.continue());
  await page.goto(URL, { waitUntil: 'networkidle' });
});
