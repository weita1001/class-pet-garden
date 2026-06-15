const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000
const SUPABASE_HOST = 'dkxhxjpzqxgwtdivlikb.supabase.co'
const DASHSCOPE_KEY = 'sk-e438cc8fafe44c69bb536db179e56131'

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.mjs': 'application/javascript; charset=utf-8',
}

function readBody(req) { return new Promise(r => { let b=''; req.on('data',c=>b+=c); req.on('end',()=>r(b)) }) }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function serveStatic(req, res) {
  let fp = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  // notify files served from d:\cc
  if (fp === '/notify.html' || fp === '/notify.json') {
    fp = path.join(__dirname, '..', fp)
  } else {
    fp = path.join(__dirname, 'dist', fp)
  }
  const ext = path.extname(fp)
  try { const c=fs.readFileSync(fp); res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream'}); res.end(c) }
  catch {
    try { const h=fs.readFileSync(path.join(__dirname,'dist','index.html')); res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}); res.end(h) }
    catch { res.writeHead(404); res.end('Not Found') }
  }
}

function proxyToSupabase(req, res) {
  const opts = { hostname:SUPABASE_HOST, path:req.url, method:req.method, headers:{...req.headers, host:SUPABASE_HOST} }
  const preq = https.request(opts, pres => { res.writeHead(pres.statusCode, pres.headers); pres.pipe(res) })
  preq.on('error', () => { res.writeHead(502); res.end('{"error":"代理失败"}') })
  req.pipe(preq)
}

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const r = https.request({ hostname, path, method:'POST', headers }, rs => {
      let d=''; rs.on('data',c=>d+=c); rs.on('end',()=>resolve(d))
    })
    r.on('error', reject)
    r.write(body)
    r.end()
  })
}

async function handleAIDesign(req, res) {
  try {
    const body = await readBody(req)
    const { description, petType } = JSON.parse(body)
    const prompt = `pixel art, cute ${petType} pet, game sprite, transparent background, 256x256, vibrant colors, simple design, ${description}`

    const resp1 = await httpsPost('dashscope.aliyuncs.com', '/api/v1/services/aigc/text2image/image-synthesis',
      { 'Content-Type':'application/json', 'Authorization':`Bearer ${DASHSCOPE_KEY}`, 'X-DashScope-Async':'enable' },
      JSON.stringify({ model:'wanx-v1', input:{ prompt }, parameters:{ size:'1024*1024', n:1 } }))

    const j1 = JSON.parse(resp1)
    const taskId = j1.output?.task_id
    if (!taskId) { res.writeHead(500); res.end(JSON.stringify({error:'AI生图失败：'+resp1})); return }

    res.writeHead(200, {'Content-Type':'application/json'})
    res.end(JSON.stringify({task_id:taskId}))
  } catch(e) {
    res.writeHead(500)
    res.end(JSON.stringify({error:'生图异常:'+e.message}))
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-client-info')
    res.writeHead(204)
    return res.end()
  }
  if (req.url === '/api/ai/design-pet' && req.method === 'POST') handleAIDesign(req, res)
  else if (req.url.startsWith('/rest/') || req.url.startsWith('/auth/') || req.url.startsWith('/storage/')) proxyToSupabase(req, res)
  else serveStatic(req, res)
})

server.listen(PORT, () => console.log(`🐾 http://127.0.0.1:${PORT}`))
