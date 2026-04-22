import { jsonResponse, readBody, checkAuth, kvGet, kvSet, kvDel, kvListAll, kvListReplace } from './_utils.js';

// Storage:
//   blog:index        -> array of slugs (newest first)
//   blog:<slug>       -> { slug, title, summary, body (markdown/html), coverUrl, lang, publishedAt, updatedAt }

function slugify(s) {
  return (s || '').toString().toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x');
    const slug = url.searchParams.get('slug');

    // Public list
    if (req.method === 'GET' && !slug) {
      const idx = (await kvGet('blog:index')) || [];
      const posts = [];
      for (const s of idx.slice(0, 50)) {
        const p = await kvGet(`blog:${s}`);
        if (p) posts.push({ slug: p.slug, title: p.title, summary: p.summary, coverUrl: p.coverUrl, lang: p.lang, publishedAt: p.publishedAt });
      }
      res.setHeader('Cache-Control', 'public, max-age=60');
      return jsonResponse(res, 200, { posts });
    }

    if (req.method === 'GET' && slug) {
      const p = await kvGet(`blog:${slug}`);
      if (!p) return jsonResponse(res, 404, { error: 'Not found' });
      return jsonResponse(res, 200, p);
    }

    // All write methods need auth
    const auth = checkAuth(req);
    if (!auth) return jsonResponse(res, 401, { error: 'Unauthorized' });

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await readBody(req);
      const title = (body.title || '').trim();
      if (!title) return jsonResponse(res, 400, { error: 'Title required' });
      const finalSlug = body.slug ? slugify(body.slug) : slugify(title);
      if (!finalSlug) return jsonResponse(res, 400, { error: 'Invalid slug' });

      const existing = (await kvGet(`blog:${finalSlug}`)) || {};
      const post = {
        slug: finalSlug,
        title,
        summary: (body.summary || '').slice(0, 400),
        body: body.body || '',
        coverUrl: body.coverUrl || '',
        lang: body.lang === 'en' ? 'en' : 'de',
        publishedAt: existing.publishedAt || Date.now(),
        updatedAt: Date.now(),
      };
      await kvSet(`blog:${finalSlug}`, post);

      const idx = (await kvGet('blog:index')) || [];
      if (!idx.includes(finalSlug)) {
        idx.unshift(finalSlug);
        await kvSet('blog:index', idx);
      }
      return jsonResponse(res, 200, { ok: true, post });
    }

    if (req.method === 'DELETE' && slug) {
      const safeSlug = slugify(slug);
      await kvDel(`blog:${safeSlug}`);
      const idx = (await kvGet('blog:index')) || [];
      const next = idx.filter(s => s !== safeSlug);
      await kvSet('blog:index', next);
      return jsonResponse(res, 200, { ok: true });
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: e.message || 'Server error' });
  }
}
