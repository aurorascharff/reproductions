import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const port = process.env.PORT || '3199'
const base = `http://localhost:${port}`
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', port], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let log = ''
for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { log += chunk })
const marker = 'Unexpected cache miss after cache warming phase'
try {
  for (let i = 0; !/Ready in/.test(log); i++) {
    assert(child.exitCode === null && i < 100, `Server did not start: ${log}`)
    await delay(100)
  }
  const results = []
  async function visit(name, cookie = '') {
    const offset = log.length
    const response = await fetch(base, { headers: cookie ? { cookie } : {} })
    const html = await response.text()
    await delay(200)
    const warnings = log.slice(offset).split('\n').filter(line => line.includes(marker))
    assert.equal(response.status, 200)
    assert(html.includes('Deterministic cached content'))
    results.push({ condition: name, status: response.status, warnings: warnings.length })
  }
  await visit('Draft Mode off')
  const response = await fetch(base + '/api/draft?enable=1', { redirect: 'manual' })
  const cookie = response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ')
  assert(cookie.includes('__prerender_bypass='), 'Expected Draft Mode cookie')
  await visit('Draft Mode on', cookie)
  await visit('Draft Mode off again')
  console.table(results)
  const expected = process.env.EXPECT_WARNING !== '0'
  assert.equal(results[0].warnings, 0)
  assert.equal(results[1].warnings > 0, expected, 'Unexpected Draft Mode warning result')
  assert.equal(results[2].warnings, 0)
  if (expected) console.log(log.split('\n').find(line => line.includes(marker)))
} finally {
  child.kill()
}
