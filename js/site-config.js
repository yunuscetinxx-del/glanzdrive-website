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
    const cities = (s.cities || []).slice(0, 21);
    const brand = s.brand?.name || 'Meine Putzhilfe';

    // City links → search page or local: link to /?city=X for now
    const cityLinks = cities.map(name =>
      `<a href="/?city=${encodeURIComponent(name)}">${name}</a>`).join('');

    const cols = (f.columns || []).map(col => `
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
      .join('');

    slot.innerHTML = `
      <section class="mph-cities-band">
        <div class="mph-cities-inner">
          <div class="mph-cities-map" aria-hidden="true">
            <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 20 Q90 10 120 25 Q160 35 175 70 Q185 110 165 145 Q150 185 110 215 Q70 230 45 200 Q20 165 25 120 Q30 75 60 20Z"
                fill="none" stroke="#3a4548" stroke-width="1.5"/>
              <circle cx="100" cy="50"  r="4" fill="#1f2a2e"/><circle cx="100" cy="50"  r="2" fill="#72deff"/>
              <circle cx="80"  cy="80"  r="4" fill="#1f2a2e"/><circle cx="80"  cy="80"  r="2" fill="#72deff"/>
              <circle cx="130" cy="85"  r="4" fill="#1f2a2e"/><circle cx="130" cy="85"  r="2" fill="#72deff"/>
              <circle cx="60"  cy="120" r="4" fill="#1f2a2e"/><circle cx="60"  cy="120" r="2" fill="#72deff"/>
              <circle cx="110" cy="130" r="4" fill="#1f2a2e"/><circle cx="110" cy="130" r="2" fill="#72deff"/>
              <circle cx="150" cy="160" r="4" fill="#1f2a2e"/><circle cx="150" cy="160" r="2" fill="#72deff"/>
              <circle cx="80"  cy="180" r="4" fill="#1f2a2e"/><circle cx="80"  cy="180" r="2" fill="#72deff"/>
            </svg>
          </div>
          <div class="mph-cities-list">
            <h2>Buchen Sie eine Putzhilfe in diesen Städten</h2>
            <div class="mph-cities-cloud">${cityLinks}</div>
            <a class="mph-cities-all" href="/documentation/#cities">Alle Städte →</a>
          </div>
        </div>
      </section>

      <footer class="mph-foot-main">
        <div class="mph-foot-grid">
          ${cols}
          <div class="mph-foot-col mph-foot-contact">
            <h4>Kontakt</h4>
            <ul>
              ${c.phone   ? `<li>📞 <a href="tel:${c.phone.replace(/[^\d+]/g,'')}" data-mph-phone>${c.phone}</a></li>` : ''}
              ${c.whatsapp? `<li>💬 <a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener">WhatsApp Chat</a></li>` : ''}
              ${c.email   ? `<li>✉️ <a href="mailto:${c.email}" data-mph-email>${c.email}</a></li>` : ''}
              ${c.address ? `<li>📍 ${c.address}</li>` : ''}
            </ul>
            ${socialLinks ? `<div class="mph-foot-social">${socialLinks}</div>` : ''}
          </div>
        </div>

        <div class="mph-foot-bottom">
          <div class="mph-foot-copy">${f.copyright || ''}</div>
          <div class="mph-foot-bottom-links">
            <a href="/impressum/">Impressum</a>
            <a href="/datenschutz/">Datenschutz</a>
            <a href="/terms-and-conditions/">AGB</a>
            <a href="#" onclick="if(window.MPH_openCookieSettings){MPH_openCookieSettings();return false}">Cookie-Einstellungen</a>
          </div>
        </div>
      </footer>
    `;

    if (!document.getElementById('mph-footer-css')) {
      const st = document.createElement('style');
      st.id = 'mph-footer-css';
      st.textContent = `
[data-mph-footer]{display:block;margin-top:80px}
.mph-cities-band{background:#e8edf2;padding:60px 0;border-top:1px solid #d8dee5}
.mph-cities-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:280px 1fr;gap:48px;align-items:center}
.mph-cities-map{display:flex;justify-content:center}
.mph-cities-map svg{max-width:240px;height:auto;opacity:.85}
.mph-cities-list h2{font-size:1.5rem;font-weight:800;color:#1f2a2e;margin:0 0 18px}
.mph-cities-cloud{columns:3;column-gap:20px;font-size:.95rem}
.mph-cities-cloud a{display:block;padding:4px 0 4px 18px;position:relative;color:#1f2a2e;text-decoration:none;font-weight:500;break-inside:avoid}
.mph-cities-cloud a::before{content:"•";color:#1f2a2e;position:absolute;left:4px}
.mph-cities-cloud a:hover{color:#0099d6;text-decoration:underline}
.mph-cities-all{display:inline-block;margin-top:16px;color:#1f2a2e;font-weight:700;text-decoration:underline;font-size:.92rem}
.mph-foot-main{background:#1f2a2e;color:rgba(255,255,255,.75);padding:60px 0 24px}
.mph-foot-grid{max-width:1200px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.mph-foot-col h4{color:#fff;font-size:.78rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 14px}
.mph-foot-col ul{list-style:none;padding:0;margin:0}
.mph-foot-col li{margin-bottom:8px;font-size:.88rem;line-height:1.5}
.mph-foot-col a{color:rgba(255,255,255,.7);text-decoration:none;transition:color .15s}
.mph-foot-col a:hover{color:#72deff;text-decoration:underline}
.mph-foot-social{display:flex;gap:10px;margin-top:18px}
.mph-foot-social a{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;transition:background .15s,color .15s}
.mph-foot-social a:hover{background:#72deff;color:#1f2a2e}
.mph-foot-bottom{max-width:1200px;margin:40px auto 0;padding:24px 24px 0;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;font-size:.82rem}
.mph-foot-copy{color:rgba(255,255,255,.5)}
.mph-foot-bottom-links{display:flex;gap:18px;flex-wrap:wrap}
.mph-foot-bottom-links a{color:rgba(255,255,255,.6);text-decoration:none}
.mph-foot-bottom-links a:hover{color:#72deff}
@media(max-width:900px){
  .mph-cities-inner{grid-template-columns:1fr}
  .mph-cities-map{display:none}
  .mph-cities-cloud{columns:2}
  .mph-foot-grid{grid-template-columns:repeat(2,1fr);gap:28px}
  .mph-foot-bottom{flex-direction:column;text-align:center}
}
@media(max-width:520px){
  .mph-cities-cloud{columns:1}
  .mph-foot-grid{grid-template-columns:1fr}
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
