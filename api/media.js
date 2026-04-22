import { jsonResponse, readBodyLarge, checkAuth, kvGet, kvSet } from './_utils.js';
import crypto from 'node:crypto';

// Storage key pattern: media:<id>  → { mime, dataB64 }
// Public route used by browsers: GET /api/media?id=<id>  -> binary

const ALLOWED_MIME = new Set([
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
  'video/mp4', 'video/webm',
]);

const MAX_BYTES = 4_500_000; // ~4.5MB after decode

export default async function handler(req, res) {
  try {
    // ------ GET: serve media bytes -------
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://x');
      const id = url.searchParams.get('id');
      if (!id || !/^[a-f0-9-]{8,}$/i.test(id)) {
        return jsonResponse(res, 400, { error: 'Bad id' });
      }
      const rec = await kvGet(`media:${id}`);
      if (!rec || !rec.dataB64) return jsonResponse(res, 404, { error: 'Not found' });
      const buf = Buffer.from(rec.dataB64, 'base64');
      res.statusCode = 200;
      res.setHeader('Content-Type', rec.mime || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
      res.setHeader('Content-Length', String(buf.length));
      return res.end(buf);
    }

    // ------ POST: upload (admin auth) -------
    if (req.method === 'POST') {
      const auth = checkAuth(req);
      if (!auth) return jsonResponse(res, 401, { error: 'Unauthorized' });

      const body = await readBodyLarge(req).catch(() => null);
      if (!body || !body.dataB64 || !body.mime) {
        return jsonResponse(res, 400, { error: 'Missing dataB64 or mime' });
      }
      if (!ALLOWED_MIME.has(body.mime)) {
        return jsonResponse(res, 400, { error: 'Unsupported MIME type' });
      }
      const approxBytes = Math.floor((body.dataB64.length * 3) / 4);
      if (approxBytes > MAX_BYTES) {
        return jsonResponse(res, 413, { error: `Too large (${approxBytes} > ${MAX_BYTES} bytes). Use a video URL instead for large videos.` });
      }

      const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
      await kvSet(`media:${id}`, {
        mime: body.mime,
        dataB64: body.dataB64,
        name: body.name || '',
        size: approxBytes,
        uploadedAt: Date.now(),
      });

      return jsonResponse(res, 200, {
        ok: true,
        id,
        url: `/api/media?id=${id}`,
        mime: body.mime,
        size: approxBytes,
      });
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: e.message || 'Server error' });
  }
}
