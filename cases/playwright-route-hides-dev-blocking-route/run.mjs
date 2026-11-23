// Requests one page in several ways and reports whether `next dev` still flags its blocking route.
// Each scenario gets a fresh dev server, so "warn once" and compile state cannot leak between them.
import { spawn, execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 3491;
const URL = `http://localhost:${PORT}/`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function withDev(fn) {
  rmSync('.next', { recursive: true, force: true });
  const dev = spawn('npx', ['next', 'dev', '-p', String(PORT)], { env: { ...process.env, NO_COLOR: '1' }, detached: true });
  let log = '';
  dev.stdout.on('data', d => (log += d));
  dev.stderr.on('data', d => (log += d));
  for (let i = 0; i < 120 && !/Ready in/.test(log); i++) await sleep(250);
  try {
    const result = await fn();
    await sleep(2500); // dev validates after the response is sent
    return { ...result, log };
  } finally {
    await sleep(1500);
    try { process.kill(-dev.pid, 'SIGKILL'); } catch {}
    await sleep(500);
  }
}

async function browse(setup, act) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleLines = [];
  page.on('console', m => consoleLines.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', e => consoleLines.push(`pageerror: ${e.message}`));
  await setup?.({ page, context });
  const echo = await (await page.goto(URL + 'api/echo')).text();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await act?.({ page, context });
  await sleep(2500);
  const overlay = await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal');
    return portal?.shadowRoot?.textContent?.replace(/\s+/g, ' ').slice(0, 160) ?? '';
  });
  await browser.close();
  return { consoleLines, overlay, echo };
}

const scenarios = {
  'curl, plain': async () => ({ consoleLines: [], overlay: '', curl: execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', URL]).toString() }),
  'curl with Cache-Control: no-cache': async () => ({ consoleLines: [], overlay: '', curl: execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-H', 'Cache-Control: no-cache', URL]).toString() }),
  'Playwright, plain goto': () => browse(),
  'Playwright, goto then reload': () => browse(null, ({ page }) => page.reload({ waitUntil: 'networkidle' })),
  'Playwright, page.route on an unrelated URL': () => browse(({ page }) => page.route('**/never-matches/**', r => r.continue())),
  'Playwright, page.route on everything': () => browse(({ page }) => page.route('**/*', r => r.continue())),
  'Playwright, context.route on an API path': () => browse(({ context }) => context.route('**/api/**', r => r.fulfill({ body: '{}' }))),
  'Playwright, no route, extra header Cache-Control: no-cache': () => browse(({ page }) => page.setExtraHTTPHeaders({ 'cache-control': 'no-cache' })),
  'Playwright, page.route that rewrites Cache-Control': () => browse(({ page }) => page.route('**/*', r => r.continue({ headers: { ...r.request().headers(), 'cache-control': 'max-age=0' } }))),
  'Playwright, page.route then unroute before goto': () => browse(async ({ page }) => { await page.route('**/x/**', r => r.continue()); await page.unrouteAll(); }),
  'Playwright, page.on("request") listener only': () => browse(({ page }) => page.on('request', () => {})),
};

// `node run.mjs <text>` runs only the scenarios whose name contains <text>.
const only = process.argv[2];
for (const [name, fn] of Object.entries(scenarios)) {
  if (only && !name.includes(only)) continue;
  const r = await withDev(fn);
  const bypass = /rendering with server caches disabled/.test(r.log) || r.consoleLines.some(l => /server caches disabled/.test(l));
  const blockingInTerminal = /blocking-route|outside of <Suspense>|Uncached data/i.test(r.log);
  const blockingInBrowser = r.consoleLines.some(l => /blocking-route|outside of <Suspense>|Uncached data/i.test(l)) || /Suspense|Blocking/i.test(r.overlay);
  console.log(`\n== ${name}`);
  console.log(`   headers the server received: ${r.echo ?? '(not a browser)'}`);
  console.log(`   cache bypass warning: ${bypass ? 'YES' : 'no'} | blocking-route error in terminal: ${blockingInTerminal ? 'YES' : 'no'} | in browser console or overlay: ${blockingInBrowser ? 'YES' : 'no'}`);
  if (process.env.VERBOSE) console.log(r.log.split('\n').slice(0, 40).join('\n'), '\n--console--\n', r.consoleLines.join('\n').slice(0, 1500), '\n--overlay--\n', r.overlay);
}
