// Shared utilities for API endpoints
// Storage: Upstash Redis (REST) if env vars present, else in-memory fallback (dev only)

const UP_URL = process.env.UPSTASH_REDIS_REST_URL;
const UP_TOK = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'changeme123!';
const JWT_SECRET = process.env.JWT_SECRET || 'glanzdrive-default-secret-CHANGE-ME';
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;
const RATE_LIMIT_PER_MIN = 5;

// In-memory fallback (Vercel functions are stateless; this only works in single-region dev)
const memStore = globalThis.__GLANZ_STORE__ ||= { messages: [], rates: {}, blocks: new Set() };

async function kvCall(cmd, ...args) {
  if (!UP_URL || !UP_TOK) return null;
  const url = `${UP_URL}/${cmd}/${args.map(encodeURIComponent).join('/')}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${UP_TOK}` } });
  if (!r.ok) return null;
  const j = await r.json();
  return j.result;
}

async function kvJson(path, body) {
  if (!UP_URL || !UP_TOK) return null;
  const r = await fetch(`${UP_URL}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UP_TOK}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.ok ? (await r.json()).result : null;
}

export async function saveMessage(msg) {
  if (UP_URL && UP_TOK) {
    await kvJson('lpush/messages', [JSON.stringify(msg)]);
    await kvCall('ltrim', 'messages', '0', '999');
  } else {
    memStore.messages.unshift(msg);
    if (memStore.messages.length > 999) memStore.messages.length = 999;
  }
}

export async function listMessages(limit = 100) {
  if (UP_URL && UP_TOK) {
    const arr = await kvCall('lrange', 'messages', '0', String(limit - 1));
    return (arr || []).map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
  }
  return memStore.messages.slice(0, limit);
}

export async function updateMessage(id, patch) {
  if (UP_URL && UP_TOK) {
    const arr = (await kvCall('lrange', 'messages', '0', '999')) || [];
    const items = arr.map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    const i = items.findIndex(m => m.id === id);
    if (i < 0) return false;
    items[i] = { ...items[i], ...patch };
    // Replace the list
    await kvCall('del', 'messages');
    if (items.length) await kvJson('rpush/messages', items.map(m => JSON.stringify(m)));
    return true;
  }
  const m = memStore.messages.find(x => x.id === id);
  if (!m) return false;
  Object.assign(m, patch);
  return true;
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
  return (Array.isArray(fwd) ? fwd[0] : fwd.split(',')[0]).trim() || 'unknown';
}

export async function rateLimit(key) {
  const now = Date.now();
  const window = 60_000;
  if (UP_URL && UP_TOK) {
    const k = `rl:${key}`;
    const count = await kvCall('incr', k);
    if (count === 1) await kvCall('expire', k, '60');
    return count <= RATE_LIMIT_PER_MIN;
  }
  memStore.rates[key] = (memStore.rates[key] || []).filter(t => now - t < window);
  memStore.rates[key].push(now);
  return memStore.rates[key].length <= RATE_LIMIT_PER_MIN;
}

export function isBlocked(ip) {
  return memStore.blocks.has(ip);
}

export function block(ip) {
  memStore.blocks.add(ip);
}

// ----- Simple HMAC-based session token (no external deps) -----
import crypto from 'node:crypto';

export function signToken(payload, ttlSec = 60 * 60 * 8) {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

export function checkAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  return verifyToken(token);
}

export function checkLogin(user, pass) {
  // timing-safe compare
  const ok = (a, b) => {
    const ab = Buffer.from(a); const bb = Buffer.from(b);
    return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
  };
  return ok(user || '', ADMIN_USER) && ok(pass || '', ADMIN_PASS);
}

// Honeypot + content checks
const SPAM_RX = /\b(viagra|casino|crypto airdrop|bitcoin doubler|loan offer|nude|porn|seo services|backlinks)\b/i;
const URL_RX = /https?:\/\//gi;

export function looksSpam({ name, message, honeypot }) {
  if (honeypot) return 'honeypot';
  if (!name || !message) return 'empty';
  if (SPAM_RX.test(message) || SPAM_RX.test(name)) return 'spam-keyword';
  const urls = (message.match(URL_RX) || []).length;
  if (urls > 2) return 'too-many-urls';
  if (message.length > 5000) return 'too-long';
  return null;
}

export function sanitize(s, max = 1000) {
  if (typeof s !== 'string') return '';
  return s.replace(/[<>\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

export async function notifyTelegram(text) {
  if (!TG_TOKEN || !TG_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch {}
}

export function jsonResponse(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50_000) { reject(new Error('body too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}
