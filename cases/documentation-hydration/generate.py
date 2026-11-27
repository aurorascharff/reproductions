"""Generate fixtures from versioned MDX; preserve component bodies and supply omitted app dependencies."""
from pathlib import Path
import re, sys, json, textwrap
docs, flash, dest = map(Path, sys.argv[1:4]); app=dest/'app'; app.mkdir(parents=True, exist_ok=True)
routes=[]; skipped=[]; only_cards='--browser-cards' in sys.argv[4:]
def write(p,s):
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s)
def blocks(path):
 for m in re.finditer(r'^```(jsx|tsx|js|ts)\b([^\n]*)\n(.*?)^```',path.read_text(),re.S|re.M):
  yield m[1],m[3]
def route(name,component,body,ext='jsx',prop='',extra='',kind='normal',parent=''):
 d=app/name;d.mkdir(parents=True,exist_ok=True)
 write(d/('example.'+ext),body+'\n'+extra)
 write(d/'page.jsx',f"""import {{Suspense}} from 'react'
import {{connection}} from 'next/server'
import {{default as Example}} from './example'
import {{Ready}} from '../ready'
async function Case() {{ {parent} return <><Example {prop}/><Ready /></> }}
export default function Page() {{return <main><h1>{name}</h1><Suspense fallback={{<p>Loading outer…</p>}}><section id="example"><Case/></section></Suspense></main>}}""")
 routes.append(dict(name=name,kind=kind,source=component))
write(app/'ready.jsx',"""'use client'
import {useEffect,useState} from 'react'
export function Ready(){const [ready,set]=useState(false);useEffect(()=>set(true),[]);return <i id="ready" data-ready={ready}/>}""")
write(app/'layout.jsx',"export default function Layout({children}) {return <html lang='en'><head><link rel='icon' href='data:,'/></head><body>{children}</body></html>}")
write(app/'page.jsx',"export default function Page(){return <p>Documentation fixtures</p>}")
write(dest/'next.config.mjs',"export default {cacheComponents:true,typescript:{ignoreBuildErrors:true},experimental:{cpus:2}}")
support="""
function DashboardShell({children}){return <section>{children}</section>}
function UpdatedAtSkeleton(){return <span>Loading time…</span>}
function TraceSkeleton(){return <span>Loading trace…</span>}
function TokenSkeleton(){return <span>Loading token…</span>}
function CachedStats(){return <p>Stats</p>}
function CachedMetrics(){return <p>Metrics</p>}
function View({data}){return <output>{String(data).length}</output>}
function ReportFooter({renderedAt}){return <footer>{renderedAt}</footer>}
function ProductsView({products}){return <p>{products.join(',')}</p>}
function randomize(products,seed){return seed<0.5?[...products].reverse():products}
async function getCachedProducts(){return ['a','b']}
async function computeReport(){return 'report'}
function Report({data}){return <p>{data}</p>}
const db={query:async value=>value}
function doWork(){}
function trackEvent(id){document.body.dataset.tracked=id}
function renderData(data){return <tbody><tr><td>{data.fixture}</td></tr></tbody>}
"""
for source in sorted((docs/'errors').glob('blocking-prerender-*.mdx')):
 slug=source.stem.removeprefix('blocking-prerender-')
 if slug not in ('current-time','random','crypto','current-time-client','random-client','crypto-client'):continue
 snippets=list(blocks(source));parts={n:c for n,(_,c) in enumerate(snippets,1)}
 for i,(lang,code) in enumerate(snippets,1):
  name=f'{slug}-{i}';label=f'{source.name}:{i}'
  if only_cards:
   if "'use client'" not in code or '  use(browser())' not in code:continue
   sym=re.search(r'export function (\w+)\(',code)[1]
   r='card-'+slug
   route(r,label,"'use client'\nimport {useState} from 'react'\nimport {"+sym+" as Subject} from './subject'\nexport default function Frame(){const [n,set]=useState(0);return <><button id='again' onClick={()=>set(n+1)}>{n}</button><div id='card'><Subject tick={n}/></div></>}",kind='browser-card')
   write(app/r/'subject.jsx',code)
   continue
  if i in (2,3) and not slug.endswith('client'):
   continue # paired with its shell below
  if i==1 and not slug.endswith('client'):
   sym={'crypto':'RequestId','current-time':'UpdatedAt','random':'RequestTrace'}[slug]
   for j in (2,3):
    r=name+'-'+str(j);route(r,label+' + '+str(j),code,extra=f"import {{{sym}}} from './child'\n"+support)
    write(app/r/'child.jsx',parts[j])
   continue
  if i==1 and slug.endswith('client'):
   sym,mod,expr={'random-client':('Avatar','avatar','Math.random()'),'current-time-client':('TimeDisplay','time-display','Date.now()'),'crypto-client':('CorrelationId','correlation-id','crypto.randomUUID()')}[slug]
   for mode in ('static','request','shared'):
    r=name+'-'+mode;route(r,label,code,kind=mode,parent='await connection();' if mode!='static' else '')
    child=f"'use client'\nexport function {sym}(){{return <span data-unstable>{{String({expr})}}</span>}}"
    if mode=='shared':
     write(app/r/'value.jsx',"'use client'\nexport function Value({value}) {return <span data-unstable>{value}</span>}")
     child=f"import {{Value}} from './value'\nimport {{io}} from 'next/cache'\nexport async function {sym}(){{await io();return <Value value={{String({expr})}}/>}}"
    write(app/r/(mod+'.jsx'),child)
   continue
  prop=''; extra=''
  for token in ['DashboardShell','UpdatedAtSkeleton','TraceSkeleton','TokenSkeleton','CachedStats','CachedMetrics','View','ReportFooter','ProductsView','randomize','getCachedProducts','computeReport','Report','db','doWork','trackEvent','renderData']:
   if re.search(r'\b'+token+r'\b',code):extra+='\n'+next(l for l in support.splitlines() if re.search(r'\b(?:function|const) '+token+r'\b',l))
  if 'api.example.com' in code: extra+="\nconst fetch=async()=>Response.json({fixture:'info'})"
  if 'export default' not in code:
   match=re.search(r'export function (\w+)\(',code)
   if match:
    sym=match[1]
    extra+=f"\nexport default function Subject(){{return <{sym} "+('onNext={()=>{}}' if 'onNext' in code else '')+"/>}"
   elif 'function InformationTable' in code:extra+='\nexport default InformationTable'
   else:
    sym=re.search(r'async function (\w+)\(',code)[1]
    extra+=f"\nexport default async function Subject(){{return <output>{{String(await {sym}()).length}}</output>}}"
  if 'function Layout(' in code:prop='children={<p>Content</p>}'
  route(name,label,code,prop=prop,extra=extra)
if only_cards:
 assert len(routes)==3, routes
 write(dest/'inventory.json',json.dumps({'routes':routes,'nonRendering':[]},indent=2))
 sys.exit(0)
guide=next((docs/'docs/01-app/02-guides').glob('migrating-to-cache-components.mdx'))
for i,(lang,code) in enumerate(blocks(guide),1):
 label=f'{guide.name}:{i}'
 if not re.search(r'export default (async )?function Page\(',code):
  skipped.append(label);continue
 extra='';prop=''
 if 'api.example.com' in code:extra+="\nconst fetch=async()=>Response.json({fixture:'data'})"
 if 'db.query' in code:extra+="\nconst db={query:async()=>'data'}"
 if '<Post slug=' in code:extra+='\nfunction Post({slug}){return <p>{slug}</p>}'
 if '<Dashboard theme=' in code:extra+='\nfunction Dashboard({theme}){return <p>{theme||"default"}</p>}'
 if 'params' in code:prop='params={Promise.resolve({slug:"test"})}'
 if 'searchParams' in code:prop='searchParams={Promise.resolve({query:"test"})}'
 route('migration-'+str(i),label,code,lang,prop=prop,extra=extra)
ref=docs/'docs/01-app/03-api-reference/04-functions/connection.mdx'
for i,(lang,code) in enumerate(blocks(ref),1):
 if 'export default' in code:route('connection-'+str(i),f'{ref.name}:{i}',code,lang)
 else:skipped.append(f'{ref.name}:{i}')
flashfile=flash/'docs/01-app/02-guides/preventing-flash-before-hydration.mdx'
fb=list(blocks(flashfile))
for lang in ('tsx','jsx'):
 client=next(c for l,c in fb if l==lang and 'function BrowserDate(' in c and 'use(browser())' in c)
 parent=next(c for l,c in fb if l==lang and "from '@/app/components/browser-date'" in c)
 name='flash-date-'+lang
 route(name,flashfile.name,parent.replace('@/app/components/browser-date','./browser-date'),lang,kind='date')
 write(app/name/('browser-date.'+lang),client)
 network=next(c for l,c in fb if l==lang and 'export default function NetworkStatus' in c)
 route('flash-network-'+lang,flashfile.name,network,lang,kind='network')
write(dest/'inventory.json',json.dumps({'routes':routes,'nonRendering':skipped},indent=2))
print(len(routes),'routes;',len(skipped),'non-rendering/config snippets')
