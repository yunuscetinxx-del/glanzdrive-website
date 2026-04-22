// GlanzDrive — Express server for Hostinger Node.js hosting
// Serves static site + wraps Vercel-style API handlers
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Security headers (replaces vercel.json) ----------
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
  // Block bad paths
  if (/^\/(wp-admin|wp-login\.php|admin\.php|\.env|\.git)/i.test(req.path)) {
    return res.redirect(302, '/');
  }
  // No-cache for admin & api
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

app.use(compression());

// ---------- Wrap Vercel-style API handlers as Express routes ----------
// Vercel handlers: export default async function (req, res) {}
// Need to add res.status() shim and parse body manually (handlers use readBody)
async function loadHandler(file) {
  const url = pathToFileURL(path.join(__dirname, 'api', file)).href;
  const mod = await import(url);
  return mod.default;
}

function adapt(handler) {
  return async (req, res) => {
    // Add Vercel-like helpers if missing
    if (!res.status) res.status = (c) => { res.statusCode = c; return res; };
    try {
      await handler(req, res);
    } catch (err) {
      console.error('API error:', err);
      if (!res.headersSent) res.status(500).json({ error: 'Server error' });
    }
  };
}

const apiRoutes = [
  ['POST', '/api/quote', 'quote.js'],
  ['POST', '/api/login', 'login.js'],
  ['GET',  '/api/messages', 'messages.js'],
  ['POST', '/api/reply', 'reply.js'],
  ['POST', '/api/chat', 'chat.js'],
];

for (const [method, route, file] of apiRoutes) {
  const handler = await loadHandler(file);
  app[method.toLowerCase()](route, adapt(handler));
}

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

app.listen(PORT, () => {
  console.log(`✅ GlanzDrive running on port ${PORT}`);
});
