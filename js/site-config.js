// === Meine Putzhilfe — Site config injector ===
// Fetches /api/settings once on every page and applies dynamic content:
// - Logo image src (every <img alt="Meine Putzhilfe">)
// - Phone / WhatsApp / email links
// - Hero media (<div data-mph-hero>) with image / video / YouTube + filter + speed
// - Helpling-style footer (<div data-mph-footer> placeholder OR replaces existing footer)
// - Cities cloud (<div data-mph-cities>)
//
// Cached in window.__MPH_SETTINGS__ + sessionStorage for fast subsequent pages.

(function () {
  const CACHE_KEY = 'mph-settings-v1';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const FILTER_CSS = {
    none:       'none',
    grayscale:  'grayscale(100%)',
    sepia:      'sepia(70%)',
    blur:       'blur(2px)',
    brightness: 'brightness(1.15) contrast(1.05)',
    cool:       'hue-rotate(-15deg) saturate(1.1) brightness(1.05)',
    warm:       'hue-rotate(15deg) saturate(1.15) brightness(1.05)',
    vintage:    'sepia(40%) contrast(1.1) brightness(1.05) saturate(0.85)',
  };

  function isYouTube(url) { return /youtu\.?be/.test(url || ''); }
  function youTubeEmbed(url) {
    let id = '';
    const m = (url || '').match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    if (m) id = m[1];
    if (!id) return '';
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1`;
  }

  async function loadSettings() {
    // Try cache first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, data } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          window.__MPH_SETTINGS__ = data;
          return data;
        }
      }
    } catch {}
    try {
      const r = await fetch('/api/settings', { cache: 'no-cache' });
      if (!r.ok) throw new Error('http ' + r.status);
      const data = await r.json();
      window.__MPH_SETTINGS__ = data;
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
      return data;
    } catch (e) {
      console.warn('[site-config] load failed', e);
      return null;
    }
  }

  function applyLogo(s) {
    if (!s.brand?.logoUrl) return;
    document.querySelectorAll('img[alt*="Putzhilfe" i], img[alt*="Meine Putzhilfe" i]').forEach(img => {
      // Skip favicons
      if (img.closest('link')) return;
      img.src = s.brand.logoUrl;
    });
  }

  // ============ Animated brand name next to logo ============
  function applyBrandText(s) {
    const name = (s.brand && s.brand.name) || 'Meine Putzhilfe';
    if (!document.getElementById('mph-brand-anim-css')) {
      const st = document.createElement('style');
      st.id = 'mph-brand-anim-css';
      st.textContent = [
        '@keyframes mphBrandType { from { width: 0 } to { width: 100% } }',
        '@keyframes mphBrandCaret { 0%,100% { border-color: transparent } 50% { border-color: #72deff } }',
        '@keyframes mphBrandShimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }',
        '@keyframes mphBrandFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }',
        '.mph-brand-text { display:inline-flex; align-items:center; margin-left:10px; font-weight:800;',
          ' font-size:clamp(0.95rem, 1.6vw, 1.25rem); letter-spacing:0.2px; white-space:nowrap;',
          ' user-select:none; pointer-events:none;',
          ' background:linear-gradient(90deg,#1f2a2e 0%,#0099d6 50%,#72deff 100%); background-size:200% 100%;',
          ' -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;',
          ' animation: mphBrandFloat 3s ease-in-out infinite, mphBrandShimmer 6s linear infinite; }',
        '.mph-brand-text > span.inner { display:inline-block; overflow:hidden; white-space:nowrap;',
          ' border-right:2px solid #72deff;',
          ' animation: mphBrandType 2.2s steps(22, end) 0.2s 1 both, mphBrandCaret 0.85s step-end infinite; }',
        '.dark .mph-brand-text { background:linear-gradient(90deg,#fff 0%,#72deff 50%,#fff 100%);',
          ' -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }',
        '@media (max-width:480px) { .mph-brand-text { display:none } }'
      ].join('\n');
      document.head.appendChild(st);
    }

    const logos = document.querySelectorAll('a > img[alt*="Putzhilfe" i]');
    logos.forEach(img => {
      const link = img.parentElement;
      if (!link || link.dataset.mphBrandBound) return;
      link.dataset.mphBrandBound = '1';
      // Make link a flex row so text aligns nicely with the logo
      try { link.style.display = 'inline-flex'; link.style.alignItems = 'center'; } catch (_) {}
      const span = document.createElement('span');
      span.className = 'mph-brand-text';
      span.setAttribute('aria-hidden', 'true');
      span.innerHTML = '<span class="inner">' + name + '</span>';
      link.appendChild(span);
    });
  }

  function applyContact(s) {
    const c = s.contact || {};
    // Phone links
    if (c.phone) {
      const tel = c.phone.replace(/[^\d+]/g, '');
      document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = 'tel:' + tel; });
      document.querySelectorAll('[data-mph-phone]').forEach(el => { el.textContent = c.phone; });
    }
    // Email
    if (c.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = 'mailto:' + c.email; });
      document.querySelectorAll('[data-mph-email]').forEach(el => { el.textContent = c.email; });
    }
    // WhatsApp
    if (c.whatsapp) {
      const wa = c.whatsapp.replace(/\D/g, '');
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        a.href = a.href.replace(/wa\.me\/\d*/, 'wa.me/' + wa);
      });
    }
    // Push to MPH_CONFIG so site-bundle.js modal uses real values
    if (window.MPH_CONFIG) {
      window.MPH_CONFIG.phone = c.phone || window.MPH_CONFIG.phone;
      window.MPH_CONFIG.whatsappNumber = c.whatsapp || window.MPH_CONFIG.whatsappNumber;
      window.MPH_CONFIG.email = c.email || window.MPH_CONFIG.email;
      window.MPH_CONFIG.address = c.address || window.MPH_CONFIG.address;
    }
  }

  function buildHero(s) {
    const slot = document.querySelector('[data-mph-hero]');
    if (!slot) return;
    const h = s.hero || {};
    if (!h.mediaUrl) return;
    const filter = FILTER_CSS[h.filter] || 'none';
    const overlay = Math.max(0, Math.min(1, Number(h.overlay) || 0));

    let media = '';
    if (h.type === 'youtube' || isYouTube(h.mediaUrl)) {
      const embed = youTubeEmbed(h.mediaUrl);
      media = `<iframe src="${embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
        style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none;filter:${filter};"></iframe>`;
    } else if (h.type === 'video') {
      const speed = Math.max(0.25, Math.min(2, Number(h.videoSpeed) || 1));
      media = `<video src="${h.mediaUrl}" ${h.videoAutoplay ? 'autoplay' : ''} ${h.videoMuted ? 'muted' : ''} ${h.videoLoop ? 'loop' : ''} playsinline
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${filter};"
        data-mph-speed="${speed}"></video>`;
    } else {
      media = `<img src="${h.mediaUrl}" alt=""
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${filter};"/>`;
    }

    slot.style.position = 'relative';
    slot.style.overflow = 'hidden';
    slot.innerHTML = media + `<div style="position:absolute;inset:0;background:rgba(0,0,0,${overlay});pointer-events:none;"></div>`;

    // Apply video speed
    const v = slot.querySelector('video[data-mph-speed]');
    if (v) {
      const sp = Number(v.dataset.mphSpeed) || 1;
      v.playbackRate = sp;
      v.addEventListener('loadedmetadata', () => { v.playbackRate = sp; });
    }
  }

  function svgIcon(name) {
    const M = {
      facebook:  '<path d="M22 12a10 10 0 10-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1 0 2.1.2 2.1.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12h2.7l-.4 2.9h-2.3v6.9A10 10 0 0022 12z"/>',
      instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.1.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.1-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 5.8.1 5 .3 4.2.6c-.8.3-1.6.7-2.3 1.4C1.2 2.6.7 3.4.4 4.2.1 5 0 5.8 0 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.1.6 2.9.3.8.7 1.6 1.4 2.3.7.7 1.5 1.1 2.3 1.4.8.3 1.6.5 2.9.6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.1-.3 2.9-.6.8-.3 1.6-.7 2.3-1.4.7-.7 1.1-1.5 1.4-2.3.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.6-1.4-2.3-.7-.7-1.5-1.1-2.3-1.4-.8-.3-1.6-.5-2.9-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.4 1.4 0 11-2.9 0 1.4 1.4 0 012.9 0z"/>',
      tiktok:    '<path d="M19.6 6.7a4.8 4.8 0 01-3-1.1V15a5.5 5.5 0 11-5.5-5.5h.6v2.7h-.6a2.8 2.8 0 102.8 2.8V0h2.7a4.8 4.8 0 003 4.4v2.3z"/>',
      youtube:   '<path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1 31 31 0 00.5-5.8 31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>',
      linkedin:  '<path d="M20.4 0H3.6A3.6 3.6 0 000 3.6v16.8A3.6 3.6 0 003.6 24h16.8a3.6 3.6 0 003.6-3.6V3.6A3.6 3.6 0 0020.4 0zM7.2 20.4H3.6V8.4h3.6v12zM5.4 6.8a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zm15 13.6h-3.6v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v5.9H8.9V8.4h3.4v1.6h.1a3.7 3.7 0 013.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.8z"/>',
    };
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">${M[name] || ''}</svg>`;
  }

  function buildFooter(s) {
    const slot = document.querySelector('[data-mph-footer]');
    if (!slot) return;
    const f  = s.footer || {};
    const c  = s.contact || {};
    const sc = s.social || {};
    const brand = s.brand?.name || 'Meine Putzhilfe';
    const tagline = s.brand?.tagline || 'Vertrauenswürdige Reinigungsdienste in ganz Deutschland';
    const year = new Date().getFullYear();

    // ---- Defaults (used when admin has not configured settings yet) ----
    const DEFAULT_CITIES = [
      'Berlin','Hamburg','München','Köln','Frankfurt','Stuttgart','Düsseldorf',
      'Leipzig','Dortmund','Essen','Bremen','Dresden','Hannover','Nürnberg',
      'Bonn','Mannheim','Karlsruhe','Wiesbaden','Münster','Augsburg','Aachen'
    ];
    const cities = (s.cities && s.cities.length ? s.cities : DEFAULT_CITIES).slice(0, 21);

    const DEFAULT_COLUMNS = [
      { title: 'Dienstleistungen', links: [
        { label: 'Wohnungsreinigung', href: '/services/' },
        { label: 'Büroreinigung',     href: '/services/' },
        { label: 'Fensterreinigung',  href: '/services/' },
        { label: 'Grundreinigung',    href: '/services/' },
        { label: 'Umzugsreinigung',   href: '/services/' }
      ]},
      { title: 'Unternehmen', links: [
        { label: 'Über uns',     href: '/about-us/' },
        { label: 'Ratgeber',     href: '/blogs/' },
        { label: 'Dokumente',    href: '/documentation/' },
        { label: 'Kontakt',      href: '/contact-us/' }
      ]},
      { title: 'Hilfe', links: [
        { label: 'FAQ',                    href: '/contact-us/#faq' },
        { label: 'Service buchen',         href: '/contact-us/' },
        { label: 'Cookie-Einstellungen',   href: '#', action: 'cookies' }
      ]}
    ];
    const columns = (f.columns && f.columns.length ? f.columns : DEFAULT_COLUMNS);

    // Defaults for contact (matches MPH_CONFIG in site-bundle.js)
    const phone    = c.phone    || '+49 176 31795410';
    const whatsapp = c.whatsapp || '4917631795410';
    const email    = c.email    || 'info@meine-putzhilfe.de';
    const address  = c.address  || 'Deutschland';

    const cityLinks = cities.map(name =>
      `<a href="/?city=${encodeURIComponent(name)}">${name}</a>`).join('');

    const cols = columns.map(col => `
      <div class="mph-foot-col">
        <h4>${col.title}</h4>
        <ul>
          ${(col.links || []).map(l => `<li><a href="${l.href || '#'}"${l.action === 'cookies' ? ' onclick="if(window.MPH_openCookieSettings){MPH_openCookieSettings();return false}" ' : ''}>${l.label}</a></li>`).join('')}
        </ul>
      </div>
    `).join('');

    const socialLinks = ['facebook','instagram','tiktok','youtube','linkedin']
      .filter(k => sc[k])
      .map(k => `<a href="${sc[k]}" target="_blank" rel="noopener" aria-label="${k}">${svgIcon(k)}</a>`)
      .join('') || ['facebook','instagram','linkedin']
        .map(k => `<a href="#" aria-label="${k}" rel="noopener">${svgIcon(k)}</a>`).join('');

    const logoUrl = s.brand?.logoUrl || '/images/logo/logo-brand.png';

    slot.innerHTML = `
      <section class="mph-cities-band">
        <div class="mph-cities-inner">
          <div class="mph-cities-map" aria-hidden="true">
            <svg viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mphMapGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#72deff" stop-opacity=".18"/>
                  <stop offset="100%" stop-color="#0099d6" stop-opacity=".06"/>
                </linearGradient>
              </defs>
              <path d="M105 12 L132 18 L150 14 L168 28 L172 46 L188 58 L196 80 L188 102 L200 122 L194 148 L178 162 L188 184 L172 208 L150 224 L130 232 L112 248 L92 244 L74 234 L58 218 L42 196 L34 172 L24 152 L30 128 L22 108 L34 86 L30 64 L48 50 L60 32 L82 22 Z"
                fill="url(#mphMapGrad)" stroke="#1f2a2e" stroke-width="1.6" stroke-linejoin="round"/>
              <g font-family="Inter,system-ui,sans-serif" font-size="7" fill="#1f2a2e" font-weight="700">
                <circle cx="138" cy="78"  r="4.5" fill="#1f2a2e"/><circle cx="138" cy="78"  r="2" fill="#72deff"/><text x="146" y="80">Berlin</text>
                <circle cx="92"  cy="58"  r="4"   fill="#1f2a2e"/><circle cx="92"  cy="58"  r="1.8" fill="#72deff"/><text x="100" y="60">Hamburg</text>
                <circle cx="100" cy="190" r="4"   fill="#1f2a2e"/><circle cx="100" cy="190" r="1.8" fill="#72deff"/><text x="108" y="192">München</text>
                <circle cx="58"  cy="118" r="3.5" fill="#1f2a2e"/><circle cx="58"  cy="118" r="1.6" fill="#72deff"/><text x="20" y="120">Köln</text>
                <circle cx="80"  cy="142" r="3.5" fill="#1f2a2e"/><circle cx="80"  cy="142" r="1.6" fill="#72deff"/><text x="22" y="144">Frankfurt</text>
                <circle cx="140" cy="158" r="3.5" fill="#1f2a2e"/><circle cx="140" cy="158" r="1.6" fill="#72deff"/><text x="148" y="160">Nürnberg</text>
                <circle cx="86"  cy="174" r="3.5" fill="#1f2a2e"/><circle cx="86"  cy="174" r="1.6" fill="#72deff"/><text x="22" y="176">Stuttgart</text>
              </g>
            </svg>
          </div>
          <div class="mph-cities-list">
            <span class="mph-cities-eyebrow">Bundesweit verfügbar</span>
            <h2>Buchen Sie eine Putzhilfe in diesen Städten</h2>
            <div class="mph-cities-cloud">${cityLinks}</div>
            <a class="mph-cities-all" href="/documentation/#cities">Alle Städte ansehen <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section class="mph-foot-trust" aria-label="Vertrauen">
        <div class="mph-foot-trust-inner">
          <div class="mph-trust-item"><span class="mph-trust-ico">✓</span><div><strong>Geprüfte Reinigungskräfte</strong><span>Persönlich verifiziert</span></div></div>
          <div class="mph-trust-item"><span class="mph-trust-ico">★</span><div><strong>4,8 / 5 Bewertung</strong><span>Tausende zufriedene Kunden</span></div></div>
          <div class="mph-trust-item"><span class="mph-trust-ico">⏱</span><div><strong>Flexible Termine</strong><span>Online in 60 Sekunden buchen</span></div></div>
          <div class="mph-trust-item"><span class="mph-trust-ico">€</span><div><strong>Faire Festpreise</strong><span>Keine versteckten Kosten</span></div></div>
        </div>
      </section>

      <footer class="mph-foot-main">
        <div class="mph-foot-top">
          <div class="mph-foot-brand">
            <img src="${logoUrl}" alt="${brand}" class="mph-foot-logo">
            <p class="mph-foot-tag">${tagline}</p>
            <ul class="mph-foot-contact-list">
              <li><span class="mph-foot-ico">📞</span><a href="tel:${phone.replace(/[^\d+]/g,'')}" data-mph-phone>${phone}</a></li>
              <li><span class="mph-foot-ico">💬</span><a href="https://wa.me/${whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><span class="mph-foot-ico">✉</span><a href="mailto:${email}" data-mph-email>${email}</a></li>
              <li><span class="mph-foot-ico">📍</span><span>${address}</span></li>
            </ul>
            <div class="mph-foot-social">${socialLinks}</div>
          </div>

          <div class="mph-foot-cols">
            ${cols}
          </div>

          <div class="mph-foot-news">
            <h4>Newsletter</h4>
            <p>Erhalten Sie Reinigungstipps und exklusive Angebote.</p>
            <form class="mph-news-form" onsubmit="event.preventDefault();var i=this.querySelector('input');var m=this.querySelector('.mph-news-msg');if(!i.value){return}m.textContent='Vielen Dank! Wir melden uns bald.';m.style.color='#72deff';i.value='';">
              <input type="email" required placeholder="Ihre E-Mail-Adresse" aria-label="E-Mail-Adresse">
              <button type="submit">Abonnieren</button>
              <div class="mph-news-msg" aria-live="polite"></div>
            </form>
            <small class="mph-news-note">Mit dem Abonnieren akzeptieren Sie unsere <a href="/datenschutz/">Datenschutzerklärung</a>.</small>
          </div>
        </div>

        <div class="mph-foot-bottom">
          <div class="mph-foot-copy">${f.copyright || `© ${year} ${brand}. Alle Rechte vorbehalten.`}</div>
          <div class="mph-foot-bottom-links">
            <a href="/impressum/">Impressum</a>
            <a href="/datenschutz/">Datenschutz</a>
            <a href="/terms-and-conditions/">AGB</a>
            <a href="#" onclick="if(window.MPH_openCookieSettings){MPH_openCookieSettings();return false}">Cookie-Einstellungen</a>
          </div>
          <div class="mph-foot-pay" aria-label="Zahlungsmethoden">
            <span>Sichere Zahlung:</span>
            <span class="mph-pay-badge">VISA</span>
            <span class="mph-pay-badge">MC</span>
            <span class="mph-pay-badge">PayPal</span>
            <span class="mph-pay-badge">SEPA</span>
          </div>
        </div>
      </footer>
    `;

    if (!document.getElementById('mph-footer-css')) {
      const st = document.createElement('style');
      st.id = 'mph-footer-css';
      st.textContent = `
[data-mph-footer]{display:block;margin-top:80px;font-family:Inter,system-ui,-apple-system,sans-serif}

/* ============ Cities band ============ */
.mph-cities-band{background:linear-gradient(180deg,#eef2f6 0%,#e3e9ef 100%);padding:72px 0;border-top:1px solid #d8dee5}
.mph-cities-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:320px 1fr;gap:56px;align-items:center}
.mph-cities-map{display:flex;justify-content:center;filter:drop-shadow(0 6px 18px rgba(31,42,46,.12))}
.mph-cities-map svg{max-width:280px;height:auto}
.mph-cities-eyebrow{display:inline-block;background:#1f2a2e;color:#72deff;font-size:.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;border-radius:999px;margin-bottom:14px}
.mph-cities-list h2{font-size:1.75rem;font-weight:800;color:#1f2a2e;margin:0 0 22px;line-height:1.2}
.mph-cities-cloud{columns:3;column-gap:24px;font-size:.95rem;margin-bottom:8px}
.mph-cities-cloud a{display:block;padding:6px 0 6px 18px;position:relative;color:#1f2a2e;text-decoration:none;font-weight:500;break-inside:avoid;transition:color .15s,transform .15s}
.mph-cities-cloud a::before{content:"";position:absolute;left:2px;top:14px;width:6px;height:6px;border-radius:50%;background:#72deff;box-shadow:0 0 0 2px rgba(114,222,255,.25)}
.mph-cities-cloud a:hover{color:#0099d6;transform:translateX(2px)}
.mph-cities-all{display:inline-flex;align-items:center;gap:6px;margin-top:18px;color:#fff;background:#1f2a2e;font-weight:700;text-decoration:none;font-size:.9rem;padding:10px 18px;border-radius:999px;transition:background .15s,transform .15s}
.mph-cities-all:hover{background:#0099d6;transform:translateY(-1px)}

/* ============ Trust strip ============ */
.mph-foot-trust{background:#1a2326;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
.mph-foot-trust-inner{max-width:1200px;margin:0 auto;padding:24px;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.mph-trust-item{display:flex;align-items:center;gap:12px;color:#fff}
.mph-trust-ico{flex:0 0 38px;width:38px;height:38px;border-radius:50%;background:rgba(114,222,255,.12);color:#72deff;display:inline-flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800}
.mph-trust-item strong{display:block;font-size:.88rem;font-weight:700;color:#fff;line-height:1.2}
.mph-trust-item span:not(.mph-trust-ico){font-size:.78rem;color:rgba(255,255,255,.6)}

/* ============ Main footer ============ */
.mph-foot-main{background:#1f2a2e;color:rgba(255,255,255,.78);padding:64px 0 24px;position:relative;overflow:hidden}
.mph-foot-main::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(114,222,255,.3),transparent)}
.mph-foot-top{max-width:1200px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1.4fr 2fr 1.2fr;gap:48px}

.mph-foot-brand .mph-foot-logo{display:block;height:48px;width:auto;margin-bottom:14px;filter:brightness(0) invert(1)}
.mph-foot-tag{font-size:.92rem;color:rgba(255,255,255,.7);line-height:1.55;margin:0 0 18px}
.mph-foot-contact-list{list-style:none;padding:0;margin:0 0 18px}
.mph-foot-contact-list li{display:flex;align-items:center;gap:10px;font-size:.9rem;margin-bottom:8px;color:rgba(255,255,255,.78)}
.mph-foot-ico{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(114,222,255,.1);color:#72deff;font-size:.85rem;flex:0 0 28px}
.mph-foot-contact-list a{color:rgba(255,255,255,.85);text-decoration:none;transition:color .15s}
.mph-foot-contact-list a:hover{color:#72deff}

.mph-foot-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.mph-foot-col h4{color:#fff;font-size:.78rem;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;margin:0 0 16px;position:relative;padding-bottom:10px}
.mph-foot-col h4::after{content:"";position:absolute;left:0;bottom:0;width:24px;height:2px;background:#72deff;border-radius:2px}
.mph-foot-col ul{list-style:none;padding:0;margin:0}
.mph-foot-col li{margin-bottom:10px;font-size:.9rem;line-height:1.5}
.mph-foot-col a{color:rgba(255,255,255,.7);text-decoration:none;transition:color .15s,padding-left .15s;display:inline-block}
.mph-foot-col a:hover{color:#72deff;padding-left:4px}

.mph-foot-social{display:flex;gap:10px;margin-top:6px}
.mph-foot-social a{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;transition:background .2s,color .2s,transform .2s}
.mph-foot-social a:hover{background:#72deff;color:#1f2a2e;transform:translateY(-2px)}

/* Newsletter */
.mph-foot-news h4{color:#fff;font-size:.78rem;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;margin:0 0 10px;padding-bottom:10px;position:relative}
.mph-foot-news h4::after{content:"";position:absolute;left:0;bottom:0;width:24px;height:2px;background:#72deff;border-radius:2px}
.mph-foot-news p{font-size:.88rem;color:rgba(255,255,255,.7);margin:0 0 14px;line-height:1.5}
.mph-news-form{display:flex;flex-direction:column;gap:8px}
.mph-news-form input{padding:12px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#fff;font-size:.9rem;outline:none;transition:border-color .15s,background .15s}
.mph-news-form input::placeholder{color:rgba(255,255,255,.4)}
.mph-news-form input:focus{border-color:#72deff;background:rgba(255,255,255,.08)}
.mph-news-form button{padding:12px 16px;border-radius:8px;border:none;background:#72deff;color:#1f2a2e;font-size:.9rem;font-weight:700;cursor:pointer;transition:background .15s,transform .15s}
.mph-news-form button:hover{background:#5cd3ff;transform:translateY(-1px)}
.mph-news-msg{font-size:.82rem;min-height:18px}
.mph-news-note{display:block;font-size:.72rem;color:rgba(255,255,255,.45);margin-top:8px;line-height:1.4}
.mph-news-note a{color:rgba(255,255,255,.7);text-decoration:underline}

/* Bottom strip */
.mph-foot-bottom{max-width:1200px;margin:48px auto 0;padding:24px 24px 0;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:.82rem}
.mph-foot-copy{color:rgba(255,255,255,.5)}
.mph-foot-bottom-links{display:flex;gap:20px;flex-wrap:wrap}
.mph-foot-bottom-links a{color:rgba(255,255,255,.6);text-decoration:none;transition:color .15s}
.mph-foot-bottom-links a:hover{color:#72deff}
.mph-foot-pay{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.5);font-size:.78rem}
.mph-pay-badge{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:24px;padding:0 8px;border-radius:4px;background:rgba(255,255,255,.1);color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.5px}

/* ============ Responsive ============ */
@media(max-width:1024px){
  .mph-foot-top{grid-template-columns:1fr 1fr;gap:36px}
  .mph-foot-news{grid-column:1 / -1}
}
@media(max-width:900px){
  .mph-cities-inner{grid-template-columns:1fr;gap:32px}
  .mph-cities-map{order:-1;max-width:220px;margin:0 auto}
  .mph-cities-cloud{columns:2}
  .mph-foot-trust-inner{grid-template-columns:repeat(2,1fr);gap:18px}
  .mph-foot-cols{grid-template-columns:repeat(3,1fr);gap:24px}
}
@media(max-width:680px){
  .mph-cities-band{padding:48px 0}
  .mph-cities-list h2{font-size:1.4rem}
  .mph-foot-top{grid-template-columns:1fr;gap:32px}
  .mph-foot-cols{grid-template-columns:repeat(2,1fr)}
  .mph-foot-bottom{flex-direction:column;text-align:center;align-items:center}
}
@media(max-width:480px){
  .mph-cities-cloud{columns:1}
  .mph-foot-trust-inner{grid-template-columns:1fr}
  .mph-foot-cols{grid-template-columns:1fr}
}`;
      document.head.appendChild(st);
    }
  }

  function applyAll(s) {
    if (!s) return;
    applyLogo(s);
    applyBrandText(s);
    applyContact(s);
    buildHero(s);
    buildFooter(s);
    if (s.meta?.description) {
      let md = document.querySelector('meta[name="description"]');
      if (md && !md.getAttribute('data-mph-locked')) md.setAttribute('content', s.meta.description);
    }
    document.documentElement.dispatchEvent(new CustomEvent('mph:settings-applied', { detail: s }));
  }

  async function init() {
    const s = await loadSettings();
    if (s) applyAll(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // expose
  window.MPH_reloadSettings = async () => {
    sessionStorage.removeItem(CACHE_KEY);
    const s = await loadSettings();
    if (s) applyAll(s);
    return s;
  };
})();
