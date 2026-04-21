import crypto from 'node:crypto';
import { readBody, saveMessage, sanitize, looksSpam, clientIp, rateLimit, notifyTelegram, jsonResponse } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });
  const ip = clientIp(req);
  if (!(await rateLimit(`quote:${ip}`))) return jsonResponse(res, 429, { error: 'Too many requests' });

  let body;
  try { body = await readBody(req); } catch { return jsonResponse(res, 400, { error: 'Invalid body' }); }

  const data = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: sanitize(body.name, 120),
    email: sanitize(body.email, 200),
    phone: sanitize(body.phone, 50),
    services: Array.isArray(body.services) ? body.services.slice(0, 10).map(s => sanitize(s, 80)) : [],
    message: sanitize(body.message, 4000),
    lang: body.lang === 'de' ? 'de' : 'en',
    page: sanitize(body.page, 200),
    ip,
    userAgent: sanitize(req.headers['user-agent'] || '', 300),
    status: 'new',
    replies: [],
  };

  const spam = looksSpam({ name: data.name, message: data.message + ' ' + data.email, honeypot: body.website });
  if (spam) return jsonResponse(res, 200, { ok: true, queued: false }); // silently drop

  if (!data.name || !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return jsonResponse(res, 400, { error: 'Name and valid email required' });
  }

  await saveMessage(data);

  // Telegram notification
  const text = [
    '🧹 <b>Neue Anfrage / New Quote Request</b>',
    `<b>Name:</b> ${data.name}`,
    `<b>Email:</b> ${data.email}`,
    `<b>Phone:</b> ${data.phone || '-'}`,
    `<b>Services:</b> ${data.services.join(', ') || '-'}`,
    data.message ? `<b>Message:</b>\n${data.message}` : '',
    `<i>${data.lang.toUpperCase()} • ${data.ip}</i>`,
  ].filter(Boolean).join('\n');
  notifyTelegram(text); // fire and forget

  return jsonResponse(res, 200, { ok: true, id: data.id });
}
