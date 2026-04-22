// GlanzDrive — Express server for Hostinger Node.js hosting
import express from 'express';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Security headers ----------
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://widget.trustpilot.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://www.google-analytics.com https://widget.trustpilot.com; " +
    "frame-src https://widget.trustpilot.com https://wa.me; " +
    "base-uri 'self'; form-action 'self';"
  );
  if (/^\/(wp-admin|wp-login\.php|admin\.php|\.env|\.git)/i.test(req.path)) {
    return res.redirect(302, '/');
  }
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

// ---------- Lazy API handler loader ----------
const handlerCache = new Map();
async function getHandler(file) {
  if (handlerCache.has(file)) return handlerCache.get(file);
  const url = pathToFileURL(path.join(__dirname, 'api', file)).href;
  const mod = await import(url);
  handlerCache.set(file, mod.default);
  return mod.default;
}

function apiRoute(method, route, file) {
  app[method.toLowerCase()](route, async (req, res) => {
    try {
      if (!res.status) res.status = (c) => { res.statusCode = c; return res; };
      const handler = await getHandler(file);
      await handler(req, res);
    } catch (err) {
      console.error(`[API ${route}]`, err);
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

// Health check for Hostinger
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// ---------- Clean URLs (folder/index.html) ----------
app.use((req, res, next) => {
  if (req.path === '/' || req.path.includes('.') || req.path.startsWith('/api')) return next();
  const clean = req.path.replace(/\/$/, '');
  const tryPath = path.join(__dirname, clean, 'index.html');
  if (fs.existsSync(tryPath)) return res.sendFile(tryPath);
  next();
});

// ---------- Static files ----------
app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (/\.(js|css|woff2?|png|jpe?g|svg|webp|gif|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// ---------- 404 fallback ----------
app.use((req, res) => {
  const notFound = path.join(__dirname, '404.html');
  if (fs.existsSync(notFound)) return res.status(404).sendFile(notFound);
  res.status(404).send('Not Found');
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error('[Express error]', err);
  if (!res.headersSent) res.status(500).send('Server error');
});

process.on('uncaughtException', (e) => console.error('[uncaught]', e));
process.on('unhandledRejection', (e) => console.error('[unhandled]', e));

// Optional compression
import('compression').then(({ default: compression }) => {
  app.use(compression());
  console.log('compression enabled');
}).catch(() => {
  console.log('compression not available, skipping');
});

app.listen(PORT, () => {
  console.log(`GlanzDrive running on port ${PORT}`);
});
