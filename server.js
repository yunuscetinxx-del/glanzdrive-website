import express from 'express';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting Meine Putzhilfe. PORT:', PORT, 'NODE:', process.version);

// ---- Multi-domain config ----
const PRIMARY_DOMAIN = 'meine-putzhilfe.de';
const REDIRECT_DOMAINS = {
  'putzretter.de': 'putzretter',
  'glanzretter.de': 'glanzretter',
  'putzkonig.de': 'putzkonig',
  'glanzkonig.de': 'glanzkonig',
  'glanzstar.de': 'glanzstar',
  'putzhof.de': 'putzhof',
  'putzheim.de': 'putzheim',
  'putzcity.de': 'putzcity',
  'glanzcity.de': 'glanzcity',
  'glanzland.de': 'glanzland',
};

app.disable('x-powered-by');

// Multi-domain 301 redirect with UTM tracking (must be FIRST middleware)
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase().replace(/^www\./, '').split(':')[0];
  if (REDIRECT_DOMAINS[host]) {
    const utm = REDIRECT_DOMAINS[host];
    return res.redirect(301, `https://${PRIMARY_DOMAIN}${req.originalUrl}${req.originalUrl.includes('?') ? '&' : '?'}utm_source=${utm}&utm_medium=domain&utm_campaign=brand_test`);
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (/^\/(wp-admin|wp-login\.php|admin\.php|\.env|\.git)/i.test(req.path)) {
    return res.redirect(302, '/');
  }
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Diagnostic: shows which storage backend is active (does NOT leak secrets)
app.get('/api/_diag', async (req, res) => {
  const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  let upstashWorks = false;
  let upstashError = null;
  if (hasUpstash) {
    try {
      const u = process.env.UPSTASH_REDIS_REST_URL;
      const t = process.env.UPSTASH_REDIS_REST_TOKEN;
      // test SET + GET
      const testVal = 'mph-diag-' + Date.now();
      const setR = await fetch(`${u}/set/mph_diag_test`, { method:'POST', headers:{ Authorization:`Bearer ${t}`, 'Content-Type':'text/plain' }, body: testVal });
      if (!setR.ok) upstashError = `SET ${setR.status}`;
      else {
        const getR = await fetch(`${u}/get/mph_diag_test`, { headers:{ Authorization:`Bearer ${t}` } });
        const gj = await getR.json().catch(()=>({}));
        upstashWorks = gj.result === testVal;
        if (!upstashWorks) upstashError = 'GET mismatch: ' + JSON.stringify(gj);
      }
    } catch (e) { upstashError = e.message; }
  }
  let fileWorks = false; let fileError = null; let fileSettings = null;
  try {
    const fs1 = await import('fs');
    const path1 = await import('path');
    const dir = path1.join(process.cwd(), 'data');
    const file = path1.join(dir, 'kv.json');
    fileWorks = fs1.existsSync(file);
    if (fileWorks) {
      const j = JSON.parse(fs1.readFileSync(file, 'utf8') || '{}');
      fileSettings = j['site:settings'] ? { hasContact: !!j['site:settings'].contact, phone: j['site:settings'].contact?.phone, updatedAt: j['site:settings'].updatedAt } : null;
    }
  } catch (e) { fileError = e.message; }
  res.json({
    env: {
      hasUpstash, hasJwt: !!process.env.JWT_SECRET, hasAdmin: !!(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD),
    },
    upstash: { works: upstashWorks, error: upstashError },
    file: { exists: fileWorks, error: fileError, settings: fileSettings, path: 'data/kv.json' },
    cwd: process.cwd(),
  });
});

const handlerCache = new Map();
function apiRoute(method, route, file) {
  app[method.toLowerCase()](route, async (req, res) => {
    try {
      if (!res.status) res.status = (c) => { res.statusCode = c; return res; };
      let h = handlerCache.get(file);
      if (!h) {
        const url = pathToFileURL(path.join(__dirname, 'api', file)).href;
        const mod = await import(url);
        h = mod.default;
        handlerCache.set(file, h);
      }
      await h(req, res);
    } catch (err) {
      console.error('[API]', route, err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    }
  });
}

apiRoute('POST', '/api/quote', 'quote.js');
apiRoute('POST', '/api/login', 'login.js');
apiRoute('GET', '/api/messages', 'messages.js');
apiRoute('POST', '/api/reply', 'reply.js');
apiRoute('POST', '/api/chat', 'chat.js');

// Site editor + media + blog
apiRoute('GET',    '/api/settings', 'settings.js');
apiRoute('POST',   '/api/settings', 'settings.js');
apiRoute('PUT',    '/api/settings', 'settings.js');
apiRoute('GET',    '/api/media',    'media.js');
apiRoute('POST',   '/api/media',    'media.js');
apiRoute('GET',    '/api/posts',    'blog-admin.js');
apiRoute('POST',   '/api/posts',    'blog-admin.js');
apiRoute('PUT',    '/api/posts',    'blog-admin.js');
apiRoute('DELETE', '/api/posts',    'blog-admin.js');

app.use((req, res, next) => {
  if (req.path === '/' || req.path.includes('.') || req.path.startsWith('/api')) return next();
  const clean = req.path.replace(/\/$/, '');
  const tryPath = path.join(__dirname, clean, 'index.html');
  if (fs.existsSync(tryPath)) return res.sendFile(tryPath);
  next();
});

app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    // Force UTF-8 charset so German umlauts (ä,ö,ü,ß) render correctly
    if (/\.html?$/i.test(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (/\.js$/i.test(filePath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (/\.css$/i.test(filePath)) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (/\.json$/i.test(filePath)) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    } else if (/\.xml$/i.test(filePath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    }
    if (/\.(js|css|woff2?|png|jpe?g|svg|webp|gif|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

app.use((req, res) => {
  const nf = path.join(__dirname, '404.html');
  if (fs.existsSync(nf)) return res.status(404).sendFile(nf);
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error('[Express error]', err);
  if (!res.headersSent) res.status(500).send('Server error');
});

process.on('uncaughtException', e => console.error('[uncaught]', e));
process.on('unhandledRejection', e => console.error('[unhandled]', e));

app.listen(PORT, '0.0.0.0', () => console.log('Meine Putzhilfe listening on 0.0.0.0:' + PORT));
