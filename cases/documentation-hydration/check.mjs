import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
const {routes,nonRendering}=JSON.parse(await fs.readFile('inventory.json'))
const browser=await chromium.launch()
const results=[]
const url='http://127.0.0.1:3127/'
const mismatch=/Minified React error #(?:418|423|425)|hydration (?:failed|mismatch)|didn't match|did not match/i
try {
 for(const route of routes) {
  const {name,kind}=route
  const ctx=await browser.newContext({locale:'en-US',timezoneId:'America/Los_Angeles'})
  const page=await ctx.newPage()
  page.setDefaultTimeout(8000)
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
  try {
   await page.clock.setFixedTime(new Date('2040-02-11T03:30:00Z'))
   const res=await page.goto(url+name,{waitUntil:'networkidle'})
   assert.equal(res.status(),200);const html=await res.text()
   await page.locator('#ready[data-ready=true]').waitFor({state:'attached'})
   if(kind==='date'){
    assert.match(html,/2026\/6\/15/);assert.equal(await page.locator('time').textContent(),'6/15/2026')
   } else if(kind==='network'){
    const status=page.locator('#example p');assert.equal(await status.textContent(),'Online')
    await ctx.setOffline(true);await page.waitForFunction(()=>document.querySelector('#example p')?.textContent==='Offline')
   } else if(['static','shared','request'].includes(kind)){
    await page.locator('[data-unstable]').waitFor()
    if(kind==='request'){assert.match(html,/<span data-unstable/);await page.waitForFunction(()=>true)}
   }
   const subject=page.locator('#example')
   for(const button of await subject.getByRole('button').all()) {
    const before=await button.textContent();await button.click()
    if(before==='Next') assert.ok(await page.locator('body').getAttribute('data-tracked'))
    else assert.notEqual(await button.textContent(),before)
   }
   if(['crypto-client-2','crypto-7'].includes(name))assert.match(await subject.locator('input').inputValue(),/^[\da-f-]{36}$/)
   if(['current-time-client-2','current-time-8'].includes(name))assert.notEqual(await subject.locator('time').textContent(),'…')
   if(kind==='request'){
    assert.ok(errors.some(e=>mismatch.test(e)), 'request-rendered raw value should trigger the positive control')
    assert.deepEqual(errors.filter(e=>!mismatch.test(e)),[])
   } else assert.deepEqual(errors,[])
   results.push({...route,pass:true,hydrationErrors:errors.filter(e=>mismatch.test(e)).length})
  }catch(e){results.push({...route,pass:false,errors,reason:e.message})}finally{await ctx.close()}
  console.log(JSON.stringify(results.at(-1)))
 }
} finally {await browser.close();await fs.writeFile('results.json',JSON.stringify({results,nonRendering},null,2))}
if(results.some(r=>!r.pass))process.exitCode=1
