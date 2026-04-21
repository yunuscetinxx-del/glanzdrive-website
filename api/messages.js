import { listMessages, checkAuth, jsonResponse } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'Method not allowed' });
  if (!checkAuth(req)) return jsonResponse(res, 401, { error: 'Unauthorized' });
  const items = await listMessages(200);
  return jsonResponse(res, 200, { ok: true, items });
}
