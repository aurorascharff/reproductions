import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import * as fs from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

process.chdir(fileURLToPath(new URL('../', import.meta.url)))
const logs = 'verification-logs'
await fs.mkdir(logs, { recursive: true })
const mode = process.argv[2]
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NO_COLOR: '1' }
delete env.__NEXT_SHOW_IGNORE_LISTED
assert(!(await fs.lstat('node_modules/clock-reader')).isSymbolicLink(), 'Install the dependency as a real package with npm ci')

function run(args, overrides = {}) {
  const proc = spawn('npm', ['exec', '--', 'next', ...args], {env: {...env, ...overrides}, stdio: ['ignore', 'pipe', 'pipe']})
  let output = ''
  for (const stream of [proc.stdout, proc.stderr]) stream.on('data', b => { output += b })
  const done = once(proc, 'close').then(([code]) => code)
  return { proc, done, output: () => output }
}
async function build(label, args = [], overrides = {}) {
  const cmd = run(['build', ...args], overrides)
  const code = await cmd.done, output = cmd.output()
  await fs.writeFile(logs + '/' + label + '.txt', output)
  console.log(label, 'exit', code)
  if (code !== 0) console.log(output.split('\n').filter(l=>/Error:|ignore-listed|readClock|ClockWidget|app\/probe\/page/.test(l)).slice(-24).join('\n') || output.slice(-1200))
  return { code, output }
}
async function controls(names) {
  // Each CI matrix job gets its own checkout. Only touch the directory created here.
  await fs.mkdir('app/probe')
  try {
    for (const [name, expected] of names) {
      await fs.copyFile('controls/' + name + '.jsx', 'app/probe/page.jsx')
      const {code, output} = await build(name, ['--debug-build-paths', 'app/probe/page.jsx'])
      assert.notEqual(code, 0, name + ' unexpectedly built')
      assert.match(output, /Route "\/probe"/)
      assert.match(output, expected)
    }
  } finally { await fs.rm('app/probe', {recursive:true}) }
}
async function diagnostic(){
  await fs.mkdir('app/probe')
  try {
    await fs.copyFile('controls/dependency.jsx','app/probe/page.jsx')
    for (const [label,flags,vars] of [
      ['default',[],{}], ['debug',['--debug-prerender'],{}],
      ['debug-full',['--debug-prerender'],{__NEXT_SHOW_IGNORE_LISTED:'true'}]
    ]) {
      const {code,output}=await build(label,flags,vars)
      assert.notEqual(code,0)
      assert.match(output,/Route "\/probe".*Date\.now\(\)/)
      if (label==='debug-full') {
        assert.match(output,/at .*readClock[^\n]*node_modules\/clock-reader\/index\.js/)
        assert.match(output,/at .*Page[^\n]*app\/probe\/page\.jsx/)
      }
    }
  } finally { await fs.rm('app/probe',{recursive:true}) }
}
const origin='http://127.0.0.1:3137'
async function until(fn, message, timeout=25000) {
  const end=Date.now()+timeout
  while(Date.now()<end) { if(await fn())return; await delay(150) }
  throw Error(message)
}
const stamp = html => {const m=html.match(/<[^>]+data-stamp="(\d+)"/); assert(m,'No clock in actual HTML');return Number(m[1])}
async function html(route) {
  const res=await fetch(origin+'/'+route);assert.equal(res.status,200,route);return res.text()
}
async function proof(browser,server){
  for (const route of ['io','connection','cache','supplied']) {
    const a=stamp(await html(route)); await delay(50); const b=stamp(await html(route))
    if(route==='cache') assert.equal(a,b); else assert(b>a,route+' must refresh on each request')
    const shell=await fs.readFile('.next/server/app/'+route+'.html','utf8')
    if(route==='cache')assert.equal(stamp(shell),a)
    else if(route!=='supplied'){assert.match(shell,/Waiting for request/); assert.doesNotMatch(shell,/<time[^>]*data-stamp/)}
    console.log('PASS actual HTML and requests:',route)
  }
  assert.match(await fs.readFile('.next/server/app/telemetry.html','utf8'),/Static result:/)
  assert.match(await fs.readFile(logs+'/fixed-build.txt','utf8'),/elapsed-ms: [\d.]+/)
  const browserTime=Date.UTC(2040,0,1)
  const hydration=/hydration|hydrating|Minified React error #(?:418|423|425)/i
  for (const route of ['browser','widget','supplied','client-boundary','mismatch']) {
    const context=await browser.newContext()
    const page=await context.newPage()
    const errors=[]
    page.on('pageerror',e=>errors.push(e.message))
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
    await page.clock.setFixedTime(new Date(browserTime))
    const response=await page.goto(origin+'/'+route); assert.equal(response.status(),200)
    const serverHtml=await response.text()
    if(route==='browser') {
      assert.match(serverHtml,/<p id="clock">Waiting for the browser<\/p>/)
      await page.waitForFunction(t=>document.querySelector('#clock')?.textContent===String(t),browserTime)
      await page.getByRole('button',{name:'Read event clock'}).click()
      assert.equal(await page.locator('#clicked').textContent(),String(browserTime))
    } else if(route==='widget') {
      assert.match(serverHtml,/<h2>First slide<\/h2>/)
      assert.doesNotMatch(serverHtml,/<section[^>]*data-initialized=/)
      await page.waitForFunction(t=>document.querySelector('#slides')?.dataset.initialized===String(t),browserTime)
    } else if(route==='supplied') {
      assert.notEqual(stamp(serverHtml),browserTime)
      assert.equal(await page.locator('#supplied').textContent(),String(stamp(serverHtml)))
    } else if(route==='client-boundary') {
      assert.match(await fs.readFile('.next/server/app/client-boundary.html','utf8'),/Loading calendar/)
      await page.locator('[data-client-clock]').waitFor()
      // A green build is the reported outcome. Capture hydration independently.
    } else {
      assert.notEqual(stamp(serverHtml),browserTime)
      await until(()=>errors.some(e=>hydration.test(e)),'Missing positive control for a hydration mismatch')
      assert.equal(await page.locator('#mismatch').textContent(),String(browserTime))
    }
    await page.waitForLoadState('networkidle')
    if(!['mismatch','client-boundary'].includes(route))assert.deepEqual(errors,[],route)
    console.log('PASS browser:',route,'hydration diagnostics:',errors.filter(e=>hydration.test(e)).length)
    await context.close()
  }
  for(const mode of ['control','io','connection']) {
    const context=await browser.newContext({extraHTTPHeaders:{'x-test-visitor':'header-fixture'}})
    await context.addCookies([{name:'visitor',value:'cookie-fixture',url:origin}])
    const page=await context.newPage();const before=server.output().length
    await page.goto(origin+'/prefetch')
    const prefetch=page.waitForResponse(r=>new URL(r.url()).pathname==='/session-'+mode && r.request().headers()['rsc']==='1',{timeout:30000})
    await page.getByRole('button',{name:mode,exact:true}).click()
    const response=await prefetch;assert.equal(response.status(),200)
    const payload=await response.text()
    assert(!payload.includes('cookie-fixture:header-fixture'),'Fresh result leaked into runtime prefetch')
    const diagnostic=()=>server.output().slice(before).split('\n').some(l=>l.includes('Route "/session-'+mode+'"')&&l.includes('Date.now()'))
    if(mode==='control')await until(diagnostic,'Missing runtime prerender diagnostic for unguarded read')
    await page.getByRole('link',{name:'Open session'}).click()
    await page.locator('#session').waitFor()
    assert.equal(await page.locator('#session').textContent(),'cookie-fixture:header-fixture')
    if(mode!=='control')assert(!diagnostic(),'Unexpected clock diagnostic for '+mode)
    console.log('PASS session prefetch and navigation:',mode)
    await context.close()
  }
}
async function production() {
  const {code,output}=await build('fixed-build')
  assert.equal(code,0,output.slice(-2400))
  // Start Next directly so SIGTERM always targets the server, not an npm wrapper.
  const proc=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port','3137'],{env,stdio:['ignore','pipe','pipe']})
  let serverLog='';for(const stream of [proc.stdout,proc.stderr])stream.on('data',b=>{serverLog+=b})
  const done=once(proc,'close');let browser
  try {
    await until(async()=>{try{return (await fetch(origin)).ok}catch{return false}},'Production server did not start')
    browser=await chromium.launch()
    await proof(browser,{output:()=>serverLog})
  } finally {await browser?.close(); proc.kill('SIGTERM'); await done; await fs.writeFile(logs+'/server.txt',serverLog)}
}
if(mode==='diagnostic')await diagnostic()
else if(mode==='clock-controls')await controls([['suspense-only',/Date\.now\(\)/],['instant-false',/new Date\(\)/],['client',/in a Client Component/]])
else if(mode==='other-controls')await controls([['random',/Math\.random\(\)/],['crypto',/randomUUID\(\)/]])
else if(mode==='production')await production()
else throw Error('Choose diagnostic, clock-controls, other-controls, or production')
