import { jsonResponse, readBody, checkAuth, kvGet, kvSet, sanitize } from './_utils.js';

const SETTINGS_KEY = 'site:settings';

const DEFAULT_SETTINGS = {
  brand: {
    name: 'Meine Putzhilfe',
    tagline: 'Vertrauenswürdige Reinigungsdienste',
    logoUrl: '/images/logo/logo-brand.png',
  },
  contact: {
    phone: '+49 176 31795410',
    whatsapp: '4917631795410',
    email: 'kontakt@meine-putzhilfe.de',
    address: 'Musterstraße 1, 10115 Berlin',
    inhaber: '',
    ustId: '',
  },
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
  },
  hero: {
    type: 'image',           // 'image' | 'video' | 'youtube'
    mediaUrl: '',            // direct URL or /api/media/<id> or YouTube embed url
    overlay: 0.45,           // 0..1 dark overlay
    filter: 'none',          // 'none'|'grayscale'|'sepia'|'blur'|'brightness'|'cool'|'warm'
    videoSpeed: 1.0,         // 0.25 .. 2.0
    videoMuted: true,
    videoLoop: true,
    videoAutoplay: true,
  },
  cities: [
    'Berlin','Potsdam','München','Hamburg','Köln','Frankfurt am Main','Düsseldorf',
    'Stuttgart','Leipzig','Dortmund','Hannover','Dresden','Bremen','Mannheim',
    'Nürnberg','Bonn','Duisburg','Wiesbaden','Essen','Münster'
  ],
  footer: {
    columns: [
      {
        title: 'Meine Putzhilfe',
        links: [
          { label: 'Über uns',          href: '/about-us' },
          { label: 'Karriere',          href: '/contact-us' },
          { label: 'Preise',            href: '/documentation/#pricing' },
          { label: 'Ratgeber-Blog',     href: '/blog/' },
          { label: 'Hilfe & FAQ',       href: '/documentation/' },
        ],
      },
      {
        title: 'Leistungen',
        links: [
          { label: 'Regelmäßige Reinigung', href: '/services/regular-cleaning/' },
          { label: 'Grundreinigung',         href: '/services/deep-cleaning/' },
          { label: 'Ein-/Auszugsreinigung',  href: '/services/movein-moveout/' },
          { label: 'Öko-Reinigung',          href: '/services/eco-friendly-cleaning/' },
          { label: 'Umzug & Lagerung',       href: '/services/removal-storage/' },
          { label: 'Renovierungsreinigung',  href: '/services/post-renovation-cleaning/' },
        ],
      },
      {
        title: 'Rechtliches',
        links: [
          { label: 'Impressum',     href: '/impressum/' },
          { label: 'Datenschutz',   href: '/datenschutz/' },
          { label: 'AGB',           href: '/terms-and-conditions/' },
          { label: 'Cookie-Einstellungen', href: '#', action: 'cookies' },
        ],
      },
    ],
    appBadges: { ios: '', android: '' },     // optional store URLs
    copyright: '© 2026 Meine Putzhilfe. Alle Rechte vorbehalten.',
  },
  meta: {
    description: 'Vertrauenswürdige Putzhilfe & Reinigungsdienste in ganz Deutschland — schnell buchen, festes Team, faire Preise.',
  },
  updatedAt: 0,
};

function deepMerge(base, patch) {
  if (Array.isArray(patch)) {
    // Preserve non-empty default array if patch is empty
    if (patch.length === 0 && Array.isArray(base) && base.length > 0) return base.slice();
    return patch.slice();
  }
  if (!patch || typeof patch !== 'object') return patch;
  const out = { ...(base || {}) };
  for (const k of Object.keys(patch)) {
    const bv = base ? base[k] : undefined;
    const pv = patch[k];
    if (pv && typeof pv === 'object' && !Array.isArray(pv)) out[k] = deepMerge(bv, pv);
    // Keep default if saved value is empty string (don't let "" override defaults)
    else if (pv === '' && bv !== undefined && bv !== '') out[k] = bv;
    else out[k] = pv;
  }
  return out;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const stored = await kvGet(SETTINGS_KEY);
      const merged = deepMerge(DEFAULT_SETTINGS, stored || {});
      // Short cache so admin changes appear quickly across the site
      res.setHeader('Cache-Control', 'public, max-age=10, must-revalidate');
      return jsonResponse(res, 200, merged);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const auth = checkAuth(req);
      if (!auth) return jsonResponse(res, 401, { error: 'Unauthorized' });

      const body = await readBody(req);
      const stored = (await kvGet(SETTINGS_KEY)) || {};
      const merged = deepMerge(DEFAULT_SETTINGS, stored);
      const next   = deepMerge(merged, body || {});
      next.updatedAt = Date.now();

      await kvSet(SETTINGS_KEY, next);
      return jsonResponse(res, 200, { ok: true, settings: next });
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: e.message || 'Server error' });
  }
}
