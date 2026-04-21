import crypto from 'node:crypto';
import { readBody, saveMessage, sanitize, looksSpam, clientIp, rateLimit, notifyTelegram, jsonResponse } from './_utils.js';

// Visitor live-chat: each message is stored as a "chat" type record
export default async function handler(req, res) {
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });
  const ip = clientIp(req);
  if (!(await rateLimit(`chat:${ip}`))) return jsonResponse(res, 429, { error: 'Too many messages' });

  let body;
  try { body = await readBody(req); } catch { return jsonResponse(res, 400, { error: 'Invalid body' }); }

  const data = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    type: 'chat',
    name: sanitize(body.name, 80) || 'Visitor',
    email: sanitize(body.email, 200),
    message: sanitize(body.message, 2000),
    sessionId: sanitize(body.sessionId, 64),
    lang: body.lang === 'de' ? 'de' : 'en',
    page: sanitize(body.page, 200),
    ip,
    status: 'new',
    replies: [],
  };

  if (looksSpam({ name: data.name, message: data.message, honeypot: body.website })) {
    return jsonResponse(res, 200, { ok: true });
  }
  if (!data.message) return jsonResponse(res, 400, { error: 'message required' });

  await saveMessage(data);
  notifyTelegram(`💬 <b>Live chat</b> from ${data.name}\n${data.message}`);
  return jsonResponse(res, 200, { ok: true, id: data.id });
}
