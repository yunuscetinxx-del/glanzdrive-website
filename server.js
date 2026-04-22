import express from 'express';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting GlanzDrive. PORT:', PORT, 'NODE:', process.version);

app.disable('x-powered-by');
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

app.listen(PORT, '0.0.0.0', () => console.log('GlanzDrive listening on 0.0.0.0:' + PORT));
