import { readBody, updateMessage, checkAuth, sanitize, jsonResponse, notifyTelegram } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });
  const auth = checkAuth(req);
  if (!auth) return jsonResponse(res, 401, { error: 'Unauthorized' });

  let body;
  try { body = await readBody(req); } catch { return jsonResponse(res, 400, { error: 'Invalid body' }); }

  const id = sanitize(body.id, 64);
  const text = sanitize(body.text, 4000);
  const status = ['new', 'in-progress', 'replied', 'closed'].includes(body.status) ? body.status : null;
  if (!id) return jsonResponse(res, 400, { error: 'id required' });

  const reply = text ? { at: new Date().toISOString(), by: auth.user, text } : null;
  const patch = {};
  if (reply) patch.replies = { $push: reply }; // marker — but updateMessage doesn't support, do manually below
  if (status) patch.status = status;

  // Re-implement push behavior here
  const { listMessages } = await import('./_utils.js');
  const items = await listMessages(999);
  const item = items.find(m => m.id === id);
  if (!item) return jsonResponse(res, 404, { error: 'Not found' });

  const updates = {};
  if (status) updates.status = status;
  if (reply) updates.replies = [...(item.replies || []), reply];

  await updateMessage(id, updates);

  if (reply) {
    notifyTelegram(`💬 Reply sent to <b>${item.name}</b> (${item.email}):\n${reply.text}`);
  }

  return jsonResponse(res, 200, { ok: true });
}
