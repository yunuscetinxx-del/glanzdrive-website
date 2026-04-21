// ===== GlanzDrive site bundle =====
// Cookie consent (GDPR/DSGVO) + WhatsApp button + Live chat + Sticky CTA + JSON-LD SEO + Quote form handler
// Configure once at the top:
const GLANZDRIVE_CONFIG = {
  whatsappNumber: '491234567890', // Replace with real number (international format, no +)
  email: 'support@glanzdrive.com',
  phone: '+1 0239 0310',
  address: { street: 'Blane Street', city: 'Manchester', country: 'GB', postal: 'M1 1AA' },
  geo: { lat: 53.4808, lng: -2.2426 },
  ga4Id: '', // 'G-XXXXXXXXXX' to enable Google Analytics 4
  trustpilotBusinessUnit: '', // Trustpilot business unit ID
};

(function () {
  const T = (en, de) => (document.documentElement.lang === 'de' ? de : en);

  // ============ 1. JSON-LD Schema.org LocalBusiness ============
  function injectSchema() {
    if (document.getElementById('gd-schema')) return;
    const lang = document.documentElement.lang || 'en';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CleaningService',
      '@id': location.origin + '/#business',
      name: 'GlanzDrive',
      description: lang === 'de'
        ? 'Professionelle Reinigungsdienste für Privatkunden – Grundreinigung, Ein-/Auszugsreinigung und mehr.'
        : 'Professional residential cleaning services – deep cleaning, move-in/move-out and more.',
      url: location.origin,
      telephone: GLANZDRIVE_CONFIG.phone,
      email: GLANZDRIVE_CONFIG.email,
      image: location.origin + '/images/logo/logo-brand.png',
      logo: location.origin + '/images/logo/logo-brand.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: GLANZDRIVE_CONFIG.address.street,
        addressLocality: GLANZDRIVE_CONFIG.address.city,
        postalCode: GLANZDRIVE_CONFIG.address.postal,
        addressCountry: GLANZDRIVE_CONFIG.address.country,
      },
      geo: { '@type': 'GeoCoordinates', latitude: GLANZDRIVE_CONFIG.geo.lat, longitude: GLANZDRIVE_CONFIG.geo.lng },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
      ],
      priceRange: '€€',
      areaServed: ['GB', 'DE'],
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '247' },
      sameAs: ['https://www.facebook.com/wrappixel', 'https://www.instagram.com/wrappixel', 'https://x.com/wrappixel'],
    };
    const s = document.createElement('script');
    s.id = 'gd-schema';
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  }

  // ============ 2. Cookie Consent (GDPR/DSGVO) ============
  function injectCookieConsent() {
    if (localStorage.getItem('gd-cookie-consent')) {
      maybeInitAnalytics(localStorage.getItem('gd-cookie-consent') === 'all');
      return;
    }
    const banner = document.createElement('div');
    banner.id = 'gd-cookie-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#1f2a2e;color:#fff;padding:20px;box-shadow:0 -8px 24px rgba(0,0,0,0.3);font-family:system-ui,sans-serif;';
    banner.innerHTML = `
      <div style="max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between;">
        <div style="flex:1;min-width:280px;">
          <h4 style="margin:0 0 6px;font-size:1rem;color:#72deff;">${T('We value your privacy', 'Wir respektieren Ihre Privatsphäre')}</h4>
          <p style="margin:0;font-size:0.85rem;line-height:1.5;color:rgba(255,255,255,0.85);">
            ${T(
              'We use cookies to improve your experience, analyze traffic, and personalize content. You can choose which cookies to accept.',
              'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, den Datenverkehr zu analysieren und Inhalte zu personalisieren. Sie können wählen, welche Cookies Sie akzeptieren.'
            )}
            <a href="/datenschutz" style="color:#72deff;text-decoration:underline;">${T('Privacy Policy', 'Datenschutzerklärung')}</a>
          </p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="gd-cc-essential" style="padding:10px 16px;background:transparent;color:#fff;border:1.5px solid #72deff;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.85rem;">${T('Essential only', 'Nur notwendige')}</button>
          <button id="gd-cc-all" style="padding:10px 18px;background:#72deff;color:#1f2a2e;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.85rem;">${T('Accept all', 'Alle akzeptieren')}</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    function close(choice) {
      localStorage.setItem('gd-cookie-consent', choice);
      banner.remove();
      maybeInitAnalytics(choice === 'all');
    }
    banner.querySelector('#gd-cc-essential').onclick = () => close('essential');
    banner.querySelector('#gd-cc-all').onclick = () => close('all');
  }

  function maybeInitAnalytics(allowed) {
    if (!allowed || !GLANZDRIVE_CONFIG.ga4Id) return;
    if (document.getElementById('gd-ga4')) return;
    const s = document.createElement('script');
    s.id = 'gd-ga4'; s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GLANZDRIVE_CONFIG.ga4Id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GLANZDRIVE_CONFIG.ga4Id, { anonymize_ip: true });
    window.gtag = gtag;
  }

  // ============ 3. WhatsApp floating button ============
  function injectWhatsApp() {
    if (document.getElementById('gd-whatsapp')) return;
    if (!GLANZDRIVE_CONFIG.whatsappNumber) return;
    const a = document.createElement('a');
    a.id = 'gd-whatsapp';
    a.href = `https://wa.me/${GLANZDRIVE_CONFIG.whatsappNumber}?text=${encodeURIComponent(T('Hello GlanzDrive, I would like to ask about your services.', 'Hallo GlanzDrive, ich habe eine Frage zu Ihren Leistungen.'))}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'WhatsApp');
    a.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9997;width:60px;height:60px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,0.4);transition:transform 0.2s;';
    a.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898 1.866 1.868 2.893 4.351 2.892 6.992-.003 5.45-4.437 9.886-9.885 9.886zM20.52 3.449C18.24 1.245 15.24.044 12.045.044 5.463.044.104 5.402.101 11.985c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.581 0 11.94-5.358 11.945-11.94 0-3.193-1.246-6.196-3.408-8.405z"/></svg>';
    a.onmouseover = () => a.style.transform = 'scale(1.1)';
    a.onmouseout = () => a.style.transform = 'scale(1)';
    document.body.appendChild(a);
  }

  // ============ 4. Sticky mobile CTA ============
  function injectStickyCta() {
    if (document.getElementById('gd-sticky-cta')) return;
    if (window.innerWidth > 768) return;
    if (location.pathname.startsWith('/admin')) return;
    const wa = GLANZDRIVE_CONFIG.whatsappNumber ? `<a href="https://wa.me/${GLANZDRIVE_CONFIG.whatsappNumber}" target="_blank" style="flex:1;padding:13px;background:#25d366;color:#fff;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;text-align:center;">WhatsApp</a>` : '';
    const cta = document.createElement('div');
    cta.id = 'gd-sticky-cta';
    cta.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9996;background:#fff;border-top:1px solid #e0e0e0;padding:10px 14px;display:flex;gap:8px;box-shadow:0 -4px 12px rgba(0,0,0,0.1);';
    cta.innerHTML = `
      <a href="tel:${GLANZDRIVE_CONFIG.phone.replace(/\s/g,'')}" style="flex:1;padding:13px;background:#1f2a2e;color:#fff;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;text-align:center;">${T('Call', 'Anrufen')}</a>
      ${wa}
      <a href="/contact-us" style="flex:1.2;padding:13px;background:#72deff;color:#1f2a2e;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;text-align:center;">${T('Book', 'Buchen')}</a>
    `;
    document.body.appendChild(cta);
    document.body.style.paddingBottom = '70px';
  }

  // ============ 5. Live chat widget ============
  function injectChatWidget() {
    if (document.getElementById('gd-chat-widget')) return;
    if (location.pathname.startsWith('/admin')) return;
    const wrap = document.createElement('div');
    wrap.id = 'gd-chat-widget';
    wrap.style.cssText = 'position:fixed;bottom:96px;right:24px;z-index:9996;';
    wrap.innerHTML = `
      <button id="gd-chat-toggle" aria-label="Chat" style="width:54px;height:54px;border-radius:50%;background:#1f2a2e;color:#72deff;border:2px solid #72deff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.25);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
      <div id="gd-chat-panel" style="display:none;position:absolute;bottom:64px;right:0;width:340px;max-width:calc(100vw - 48px);background:#fff;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,0.25);overflow:hidden;font-family:system-ui,sans-serif;color:#1f2a2e;">
        <div style="background:#1f2a2e;color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:700;font-size:0.95rem;">${T('Chat with us', 'Chatten Sie mit uns')}</div>
            <div style="font-size:0.7rem;opacity:0.7;">${T('We reply within minutes', 'Antwort innerhalb weniger Minuten')}</div>
          </div>
          <button id="gd-chat-close" style="background:none;border:none;color:#fff;cursor:pointer;font-size:1.4rem;line-height:1;">×</button>
        </div>
        <div id="gd-chat-body" style="padding:14px;max-height:280px;overflow-y:auto;font-size:0.88rem;">
          <div style="background:#f0fbff;padding:10px 12px;border-radius:10px;margin-bottom:10px;">${T('Hi 👋 How can we help you today?', 'Hallo 👋 Wie können wir Ihnen heute helfen?')}</div>
        </div>
        <form id="gd-chat-form" style="padding:12px;border-top:1px solid #eee;display:flex;flex-direction:column;gap:8px;">
          <input type="text" name="name" placeholder="${T('Your name', 'Ihr Name')}" style="padding:10px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem;outline:none;">
          <input type="email" name="email" placeholder="${T('Your email (optional)', 'Ihre E-Mail (optional)')}" style="padding:10px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem;outline:none;">
          <textarea name="message" placeholder="${T('Type your message...', 'Ihre Nachricht...')}" required rows="2" style="padding:10px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem;outline:none;resize:none;font-family:inherit;"></textarea>
          <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;" aria-hidden="true">
          <button type="submit" style="padding:10px;background:#72deff;color:#1f2a2e;border:none;border-radius:6px;font-weight:700;cursor:pointer;">${T('Send', 'Senden')}</button>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);
    const panel = wrap.querySelector('#gd-chat-panel');
    wrap.querySelector('#gd-chat-toggle').onclick = () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; };
    wrap.querySelector('#gd-chat-close').onclick = () => { panel.style.display = 'none'; };
    const form = wrap.querySelector('#gd-chat-form');
    const body = wrap.querySelector('#gd-chat-body');
    let sessionId = sessionStorage.getItem('gd-chat-sid');
    if (!sessionId) { sessionId = Math.random().toString(36).slice(2) + Date.now(); sessionStorage.setItem('gd-chat-sid', sessionId); }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const msg = fd.get('message');
      if (!msg) return;
      const userBubble = document.createElement('div');
      userBubble.style.cssText = 'background:#72deff;padding:10px 12px;border-radius:10px;margin-bottom:10px;margin-left:30px;';
      userBubble.textContent = msg;
      body.appendChild(userBubble);
      body.scrollTop = body.scrollHeight;
      form.querySelector('textarea').value = '';
      try {
        await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), message: msg, website: fd.get('website'), sessionId, lang: document.documentElement.lang || 'en', page: location.pathname }),
        });
        const ack = document.createElement('div');
        ack.style.cssText = 'background:#f0fbff;padding:10px 12px;border-radius:10px;margin-bottom:10px;';
        ack.textContent = T('Thanks! Our team will reply shortly.', 'Danke! Unser Team antwortet in Kürze.');
        body.appendChild(ack);
        body.scrollTop = body.scrollHeight;
      } catch (e) {
        const err = document.createElement('div');
        err.style.cssText = 'background:#fde2e4;color:#a00;padding:10px 12px;border-radius:10px;margin-bottom:10px;';
        err.textContent = T('Failed to send. Please try again or call us.', 'Fehler beim Senden. Bitte erneut versuchen.');
        body.appendChild(err);
      }
    });
  }

  // ============ 6. Quote form handler ============
  function attachQuoteForm() {
    document.querySelectorAll('form').forEach(form => {
      // Heuristic: forms containing both name and email and not the chat widget
      const hasName = form.querySelector('input[name="name"]');
      const hasEmail = form.querySelector('input[name="email"]');
      if (!hasName || !hasEmail) return;
      if (form.closest('#gd-chat-widget')) return;
      if (form.dataset.gdAttached) return;
      form.dataset.gdAttached = '1';

      // Inject a custom message textarea + honeypot if not present
      if (!form.querySelector('textarea[name="message"]')) {
        const wrap = document.createElement('div');
        wrap.style.marginTop = '10px';
        wrap.innerHTML = `
          <textarea name="message" rows="3" placeholder="${T('Tell us about your home or any special requests... (e.g. number of rooms, preferred date, pets)', 'Erzählen Sie uns kurz von Ihrem Zuhause oder besonderen Wünschen... (z. B. Anzahl Räume, Wunschtermin, Haustiere)')}" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;font-family:inherit;font-size:0.9rem;resize:vertical;outline:none;"></textarea>
          <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;" aria-hidden="true">
        `;
        // Insert before submit button if possible
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && submitBtn.parentNode) submitBtn.parentNode.insertBefore(wrap, submitBtn.parentNode);
        else form.appendChild(wrap);
      }

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const services = [...form.querySelectorAll('label')].filter(l => {
          const cb = form.querySelector(`#${CSS.escape(l.getAttribute('for') || '')}`);
          if (!cb) return false;
          const span = document.querySelector(`[aria-checked="true"][id$="${l.htmlFor}"]`);
          return !!span;
        }).map(l => l.textContent.trim());
        // Better: collect all checked role=checkbox via aria-checked
        const checkedServices = [...form.parentElement.querySelectorAll('[role="checkbox"][aria-checked="true"]')].map(s => {
          const id = s.id;
          const label = document.querySelector(`label[for="${form.querySelector('input[type=checkbox][aria-hidden=true]')?.id}"]`);
          return label?.textContent || '';
        }).filter(Boolean);

        // Simpler: read sibling labels of inputs[type=checkbox]
        const altServices = [...form.parentElement.querySelectorAll('input[type="checkbox"][aria-hidden="true"]')]
          .filter(i => i.previousElementSibling?.getAttribute('aria-checked') === 'true' || i.checked)
          .map(i => document.querySelector(`label[for="${i.id}"]`)?.textContent?.trim()).filter(Boolean);

        const payload = {
          name: hasName.value,
          email: hasEmail.value,
          phone: form.querySelector('input[name="number"], input[name="phone"], input[type="tel"]')?.value || '',
          services: altServices.length ? altServices : services,
          message: form.querySelector('textarea[name="message"]')?.value || '',
          website: form.querySelector('input[name="website"]')?.value || '',
          lang: document.documentElement.lang || 'en',
          page: location.pathname,
        };

        const submit = form.querySelector('button[type="submit"]');
        const origLabel = submit?.textContent;
        if (submit) { submit.disabled = true; submit.textContent = T('Sending...', 'Wird gesendet...'); }
        try {
          const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || 'Failed');
          showToast(T('Thank you! We will contact you shortly.', 'Vielen Dank! Wir melden uns in Kürze.'), 'success');
          form.reset();
        } catch (e) {
          showToast(T('Could not send. Please try again or call us.', 'Senden fehlgeschlagen. Bitte erneut versuchen.'), 'error');
        } finally {
          if (submit) { submit.disabled = false; submit.textContent = origLabel; }
        }
      });
    });
  }

  function showToast(msg, type) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${type === 'error' ? '#d32f2f' : '#1f2a2e'};color:#fff;padding:14px 22px;border-radius:8px;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:gdToast 0.3s;`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  // ============ Init ============
  function init() {
    injectSchema();
    injectCookieConsent();
    injectWhatsApp();
    injectStickyCta();
    injectChatWidget();
    attachQuoteForm();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Toast animation
  const css = document.createElement('style');
  css.textContent = '@keyframes gdToast{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(css);
})();
