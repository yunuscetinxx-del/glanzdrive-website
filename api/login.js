import { readBody, checkLogin, signToken, jsonResponse, clientIp, rateLimit } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });
  const ip = clientIp(req);
  if (!(await rateLimit(`login:${ip}`))) return jsonResponse(res, 429, { error: 'Too many attempts' });

  let body;
  try { body = await readBody(req); } catch { return jsonResponse(res, 400, { error: 'Invalid body' }); }

  if (!checkLogin(body.user, body.pass)) {
    // Constant-ish delay to mitigate timing
    await new Promise(r => setTimeout(r, 600));
    return jsonResponse(res, 401, { error: 'Invalid credentials' });
  }

  const token = signToken({ user: body.user, role: 'admin' });
  return jsonResponse(res, 200, { ok: true, token });
}
