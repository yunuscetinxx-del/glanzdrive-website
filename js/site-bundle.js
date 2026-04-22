// ===== Meine Putzhilfe site bundle =====
// Cookie consent (GDPR/DSGVO) + WhatsApp button + Live chat + Sticky CTA + JSON-LD SEO + Quote form handler
// Configure once at the top:
const MPH_CONFIG = {
  whatsappNumber: '4917631795410', // Owner WhatsApp (international, no +)
  email: 'kontakt@meine-putzhilfe.de',
  phone: '+49 176 31795410',
  address: { street: 'Musterstraße 1', city: 'Berlin', country: 'DE', postal: '10115' },
  geo: { lat: 52.5200, lng: 13.4050 },
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
      name: 'Meine Putzhilfe',
      description: lang === 'de'
        ? 'Professionelle Reinigungsdienste für Privatkunden – Grundreinigung, Ein-/Auszugsreinigung und mehr.'
        : 'Professional residential cleaning services – deep cleaning, move-in/move-out and more.',
      url: location.origin,
      telephone: MPH_CONFIG.phone,
      email: MPH_CONFIG.email,
      image: location.origin + '/images/logo/logo-brand.png',
      logo: location.origin + '/images/logo/logo-brand.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: MPH_CONFIG.address.street,
        addressLocality: MPH_CONFIG.address.city,
        postalCode: MPH_CONFIG.address.postal,
        addressCountry: MPH_CONFIG.address.country,
      },
      geo: { '@type': 'GeoCoordinates', latitude: MPH_CONFIG.geo.lat, longitude: MPH_CONFIG.geo.lng },
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

  // ============ 1b. FAQ Schema + Visible FAQ Section (Homepage only) ============
  const FAQ_DE = [
    { q: 'Was kostet eine Putzhilfe in Deutschland?',
      a: 'Eine angemeldete Putzhilfe kostet in Deutschland zwischen 15 und 25 € pro Stunde. Reinigungsfirmen liegen bei 25–40 € pro Stunde, dafür sind Versicherung, Putzmittel und Vertretung enthalten. Mit dem Steuerbonus (§ 35a EStG) sparen Sie bis zu 20 % zurück.' },
    { q: 'Muss ich meine Putzhilfe anmelden?',
      a: 'Ja. Eine private Putzhilfe muss als Mini-Job über die Minijob-Zentrale angemeldet werden (Haushaltsscheck-Verfahren). Bei Reinigungsfirmen entfällt die Anmeldung – Sie erhalten eine Rechnung. Schwarzarbeit kann mit bis zu 5.000 € Bußgeld geahndet werden.' },
    { q: 'Wie viel kann ich von der Steuer absetzen?',
      a: 'Bei einer Mini-Job-Putzhilfe bis zu 510 € pro Jahr. Bei einer Reinigungsfirma bis zu 4.000 € pro Jahr (20 % von max. 20.000 € Rechnungsbetrag). Wichtig: Zahlung muss per Überweisung erfolgen, nicht bar.' },
    { q: 'Sind Ihre Reinigungskräfte versichert?',
      a: 'Ja. Alle vermittelten Reinigungskräfte sind haftpflichtversichert. Das deckt Schäden während der Reinigung ab – z. B. zerbrochene Vasen oder beschädigte Möbel. Die Versicherung gilt automatisch bei jedem Auftrag.' },
    { q: 'In welchen Städten sind Sie verfügbar?',
      a: 'Wir sind bundesweit aktiv – mit Schwerpunkt in Berlin, München, Hamburg, Köln, Frankfurt, Stuttgart, Düsseldorf und vielen weiteren Städten. Senden Sie uns eine Anfrage mit Ihrer PLZ – wir prüfen die Verfügbarkeit kostenfrei.' },
    { q: 'Wie schnell kann ich eine Putzhilfe bekommen?',
      a: 'In der Regel innerhalb von 48–72 Stunden. Für Endreinigungen (Wohnungsübergabe) und Notfälle bieten wir auch Express-Termine innerhalb von 24 Stunden an – je nach Region und Verfügbarkeit.' },
    { q: 'Bringen Sie eigene Putzmittel mit?',
      a: 'Ja, auf Wunsch. Reinigungsfirmen bringen standardmäßig professionelle Mittel und Geräte mit. Bei einer privaten Putzhilfe stellen meist Sie die Mittel – das spart 1–2 € pro Stunde. Wir besprechen das vor dem ersten Termin.' },
    { q: 'Kann ich die Reinigung kurzfristig absagen?',
      a: 'Ja. Bis 24 Stunden vor dem Termin ist die Absage kostenfrei. Bei kürzfristigen Absagen können je nach Vertrag Stornogebühren anfallen. Im Krankheitsfall finden wir gemeinsam eine flexible Lösung.' },
  ];
  const FAQ_EN = [
    { q: 'How much does a cleaning helper cost in Germany?',
      a: 'A registered cleaning helper costs between €15–25 per hour. Cleaning companies charge €25–40, including insurance, supplies and substitution. With tax bonus (§ 35a) you save up to 20 % back.' },
    { q: 'Do I have to register my cleaning helper?',
      a: 'Yes. Private helpers must be registered as a Mini-Job via the Minijob-Zentrale. With cleaning companies you receive an invoice — no registration required. Undeclared work can be fined up to €5,000.' },
    { q: 'How much can I deduct from taxes?',
      a: 'Mini-Job: up to €510/year. Cleaning company: up to €4,000/year (20 % of max €20,000 invoice). Important: payment must be by bank transfer, not cash.' },
    { q: 'Are your cleaners insured?',
      a: 'Yes. All cleaners are covered by liability insurance for damages during cleaning — broken vases, damaged furniture, etc. Coverage is automatic on every job.' },
    { q: 'Which cities do you cover?',
      a: 'Nationwide — with focus on Berlin, Munich, Hamburg, Cologne, Frankfurt, Stuttgart, Düsseldorf and many more. Send us your ZIP — we check availability for free.' },
    { q: 'How fast can I book a cleaner?',
      a: 'Usually within 48–72 hours. For move-out cleanings and emergencies we offer express slots within 24 hours, depending on region.' },
    { q: 'Do you bring your own cleaning supplies?',
      a: 'Yes, on request. Cleaning companies bring professional supplies by default. With private helpers you usually provide them — saves €1–2/hour. We agree before first appointment.' },
    { q: 'Can I cancel a cleaning short-notice?',
      a: 'Yes. Cancellation is free up to 24 hours before. Shorter notice may incur fees per contract. In case of illness we find a flexible solution.' },
  ];

  function injectFaq() {
    if (location.pathname !== '/' && location.pathname !== '/index.html') return;
    if (document.getElementById('mph-faq-schema')) return;
    const lang = document.documentElement.lang || 'en';
    const items = lang === 'de' ? FAQ_DE : FAQ_EN;

    // 1. JSON-LD FAQPage schema
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(it => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    };
    const sc = document.createElement('script');
    sc.id = 'mph-faq-schema';
    sc.type = 'application/ld+json';
    sc.textContent = JSON.stringify(schema);
    document.head.appendChild(sc);

    // 2. Visible FAQ section (before footer)
    const footer = document.querySelector('footer');
    if (!footer) return;
    const sec = document.createElement('section');
    sec.id = 'mph-faq';
    sec.style.cssText = 'background:#f7fbfc;padding:60px 20px;font-family:system-ui,-apple-system,sans-serif;';
    sec.innerHTML = `
      <div style="max-width:880px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:36px;">
          <span style="display:inline-block;background:#72deff;color:#1f2a2e;padding:6px 16px;border-radius:999px;font-weight:700;font-size:0.8rem;margin-bottom:14px;">FAQ</span>
          <h2 style="font-size:2rem;margin:0 0 10px;color:#1f2a2e;">${T('Frequently Asked Questions', 'Häufig gestellte Fragen')}</h2>
          <p style="color:#5a6b71;margin:0;font-size:1rem;">${T('Everything you need to know before booking a cleaner.', 'Alles, was Sie vor der Buchung wissen müssen.')}</p>
        </div>
        <div id="mph-faq-list">
          ${items.map((it, i) => `
            <details style="background:#fff;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px rgba(31,42,46,0.06);overflow:hidden;">
              <summary style="padding:18px 22px;cursor:pointer;font-weight:700;font-size:1.02rem;color:#1f2a2e;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                <span>${it.q}</span>
                <span style="color:#72deff;font-size:1.4rem;font-weight:400;transition:transform 0.2s;">+</span>
              </summary>
              <div style="padding:0 22px 20px;color:#3a4548;line-height:1.65;font-size:0.95rem;">${it.a}</div>
            </details>
          `).join('')}
        </div>
        <div style="text-align:center;margin-top:30px;">
          <a href="/contact-us/" style="display:inline-block;background:#1f2a2e;color:#fff;padding:14px 32px;border-radius:999px;font-weight:700;text-decoration:none;">${T('Still have questions? Contact us', 'Noch Fragen? Kontaktieren Sie uns')}</a>
        </div>
      </div>
      <style>
        #mph-faq details[open] summary span:last-child{transform:rotate(45deg);}
        #mph-faq summary::-webkit-details-marker{display:none;}
        #mph-faq summary:hover{background:#f0fbff;}
      </style>
    `;
    footer.parentNode.insertBefore(sec, footer);
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
    if (!allowed || !MPH_CONFIG.ga4Id) return;
    if (document.getElementById('gd-ga4')) return;
    const s = document.createElement('script');
    s.id = 'gd-ga4'; s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${MPH_CONFIG.ga4Id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', MPH_CONFIG.ga4Id, { anonymize_ip: true });
    window.gtag = gtag;
  }

  // ============ 3. WhatsApp floating button ============
  function injectWhatsApp() {
    if (document.getElementById('gd-whatsapp')) return;
    if (!MPH_CONFIG.whatsappNumber) return;
    const a = document.createElement('a');
    a.id = 'gd-whatsapp';
    a.href = `https://wa.me/${MPH_CONFIG.whatsappNumber}?text=${encodeURIComponent(T('Hello Meine Putzhilfe, I would like to ask about your services.', 'Hallo Meine Putzhilfe, ich habe eine Frage zu Ihren Leistungen.'))}`;
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
    const wa = MPH_CONFIG.whatsappNumber ? `<a href="https://wa.me/${MPH_CONFIG.whatsappNumber}" target="_blank" style="flex:1;padding:13px;background:#25d366;color:#fff;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;text-align:center;">WhatsApp</a>` : '';
    const cta = document.createElement('div');
    cta.id = 'gd-sticky-cta';
    cta.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9996;background:#fff;border-top:1px solid #e0e0e0;padding:10px 14px;display:flex;gap:8px;box-shadow:0 -4px 12px rgba(0,0,0,0.1);';
    cta.innerHTML = `
      <a href="tel:${MPH_CONFIG.phone.replace(/\s/g,'')}" style="flex:1;padding:13px;background:#1f2a2e;color:#fff;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;text-align:center;">${T('Call', 'Anrufen')}</a>
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
        // Collect checked services: walk each role=checkbox span, find its sibling input + matching label
        const altServices = [];
        form.parentElement.querySelectorAll('span[role="checkbox"][aria-checked="true"]').forEach(span => {
          const input = span.parentElement?.querySelector('input[type="checkbox"][aria-hidden="true"]');
          if (!input) return;
          const lbl = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
          if (lbl) altServices.push(lbl.textContent.trim());
        });

        const payload = {
          name: hasName.value,
          email: hasEmail.value,
          phone: form.querySelector('input[name="number"], input[name="phone"], input[type="tel"]')?.value || '',
          services: altServices,
          message: form.querySelector('textarea[name="message"]')?.value || '',
          website: form.querySelector('input[name="website"]')?.value || '',
          lang: document.documentElement.lang || 'de',
          page: location.pathname,
        };

        const submit = form.querySelector('button[type="submit"]');
        const origLabel = submit?.textContent;
        if (submit) { submit.disabled = true; submit.textContent = T('Sending...', 'Wird gesendet...'); }
        try {
          const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || 'Failed');
          showThankYouModal(payload.name);
          form.reset();
          // Reset all checkboxes visually too
          form.parentElement.querySelectorAll('span[role="checkbox"][aria-checked="true"]').forEach(span => {
            span.setAttribute('aria-checked', 'false');
            span.setAttribute('data-unchecked', '');
            span.removeAttribute('data-checked');
            span.innerHTML = '';
            span.style.background = '';
            span.style.borderColor = '';
            const inp = span.parentElement?.querySelector('input[type="checkbox"][aria-hidden="true"]');
            if (inp) inp.checked = false;
          });
        } catch (e) {
          showToast(T('Could not send. Please try again or call us.', 'Senden fehlgeschlagen. Bitte erneut versuchen oder rufen Sie uns an.'), 'error');
        } finally {
          if (submit) { submit.disabled = false; submit.textContent = origLabel; }
        }
      });
    });
  }

  function showThankYouModal(name) {
    // Remove existing modal if any
    const existing = document.getElementById('mph-thanks-modal');
    if (existing) existing.remove();

    const lang = document.documentElement.lang === 'de' ? 'de' : 'en';
    const phone = (MPH_CONFIG.phone || '+49 176 31795410').replace(/\s+/g, '');
    const wa = (MPH_CONFIG.whatsappNumber || '4917631795410').replace(/\D/g, '');
    const firstName = (name || '').trim().split(/\s+/)[0] || '';

    const txt = lang === 'de' ? {
      title: firstName ? `Vielen Dank, ${firstName}! 🎉` : 'Vielen Dank! 🎉',
      sub: 'Ihre Anfrage ist bei uns eingegangen.',
      promise: 'Wir melden uns innerhalb von <strong>2 Stunden</strong> mit einem persönlichen Angebot per E-Mail oder WhatsApp.',
      faster: 'Sie möchten es schneller besprechen? Schreiben Sie uns direkt:',
      wa: 'WhatsApp Nachricht senden',
      call: 'Jetzt anrufen',
      close: 'Schließen',
      waMsg: 'Hallo Meine Putzhilfe! Ich habe gerade ein Angebot über die Webseite angefragt und hätte gerne kurz Rückmeldung.'
    } : {
      title: firstName ? `Thank you, ${firstName}! 🎉` : 'Thank you! 🎉',
      sub: 'Your request has been received.',
      promise: 'We will respond within <strong>2 hours</strong> with a personalized quote via email or WhatsApp.',
      faster: 'Want to talk faster? Reach out directly:',
      wa: 'Send WhatsApp Message',
      call: 'Call Now',
      close: 'Close',
      waMsg: 'Hello Meine Putzhilfe! I just submitted a quote request on your website and wanted a quick response.'
    };

    const overlay = document.createElement('div');
    overlay.id = 'mph-thanks-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,28,0.65);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;animation:mphFade .25s ease;backdrop-filter:blur(4px);';

    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" aria-labelledby="mph-thanks-title" style="background:#fff;border-radius:18px;max-width:460px;width:100%;padding:36px 28px 28px;box-shadow:0 20px 60px rgba(0,0,0,.35);position:relative;animation:mphPop .3s cubic-bezier(.18,.89,.32,1.28);">
        <button type="button" id="mph-thanks-close" aria-label="${txt.close}" style="position:absolute;top:12px;right:12px;background:#f3f4f6;border:none;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;color:#555;display:flex;align-items:center;justify-content:center;">×</button>

        <div style="text-align:center;margin-bottom:18px;">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#72deff 0%,#45b8f5 100%);display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 6px 18px rgba(114,222,255,.4);">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1f2a2e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 id="mph-thanks-title" style="margin:0 0 6px;font-size:1.5rem;font-weight:800;color:#1f2a2e;">${txt.title}</h3>
          <p style="margin:0;color:#666;font-size:.95rem;">${txt.sub}</p>
        </div>

        <div style="background:#f0fbff;border-left:4px solid #72deff;padding:14px 16px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:0;color:#1f2a2e;font-size:.92rem;line-height:1.55;">${txt.promise}</p>
        </div>

        <p style="margin:0 0 12px;color:#555;font-size:.88rem;text-align:center;">${txt.faster}</p>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <a href="https://wa.me/${wa}?text=${encodeURIComponent(txt.waMsg)}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#fff;padding:14px 18px;border-radius:10px;text-decoration:none;font-weight:700;font-size:.95rem;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 12px rgba(37,211,102,.3);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ${txt.wa}
          </a>
          <a href="tel:${phone}" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#1f2a2e;color:#fff;padding:14px 18px;border-radius:10px;text-decoration:none;font-weight:700;font-size:.95rem;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 12px rgba(31,42,46,.25);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
            ${txt.call} · ${MPH_CONFIG.phone || '+49 176 3179 5410'}
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.style.animation = 'mphFade .2s ease reverse';
      setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 180);
    };
    overlay.querySelector('#mph-thanks-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    // Inject animation styles once
    if (!document.getElementById('mph-thanks-css')) {
      const s = document.createElement('style');
      s.id = 'mph-thanks-css';
      s.textContent = '@keyframes mphFade{from{opacity:0}to{opacity:1}}@keyframes mphPop{from{opacity:0;transform:scale(.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}#mph-thanks-modal a:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.25)!important}#mph-thanks-close:hover{background:#e5e7eb!important;color:#1f2a2e!important}';
      document.head.appendChild(s);
    }
  }

  function showToast(msg, type) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${type === 'error' ? '#d32f2f' : '#1f2a2e'};color:#fff;padding:14px 22px;border-radius:8px;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:gdToast 0.3s;`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  // ============ Fix custom base-ui checkboxes (toggle on click) ============
  function fixCheckboxes() {
    function toggle(span) {
      const checked = span.getAttribute('aria-checked') === 'true';
      const next = !checked;
      span.setAttribute('aria-checked', String(next));
      if (next) { span.setAttribute('data-checked', ''); span.removeAttribute('data-unchecked'); }
      else { span.setAttribute('data-unchecked', ''); span.removeAttribute('data-checked'); }
      // Sync hidden input (next sibling)
      const input = span.parentElement?.querySelector('input[type="checkbox"][aria-hidden="true"]');
      if (input) input.checked = next;
      // Visual: add a checkmark icon when checked
      if (next && !span.querySelector('.mph-check-icon')) {
        span.innerHTML = '<svg class="mph-check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#1f2a2e;"><polyline points="20 6 9 17 4 12"/></svg>';
        span.style.background = '#72deff';
        span.style.borderColor = '#72deff';
      } else if (!next) {
        span.innerHTML = '';
        span.style.background = '';
        span.style.borderColor = '';
      }
    }

    document.querySelectorAll('span[role="checkbox"][data-slot="checkbox"]').forEach(span => {
      if (span.dataset.mphBound) return;
      span.dataset.mphBound = '1';
      span.style.cursor = 'pointer';
      span.addEventListener('click', e => { e.preventDefault(); toggle(span); });
      span.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(span); }
      });
      // Make label clickable too
      const input = span.parentElement?.querySelector('input[type="checkbox"][aria-hidden="true"]');
      if (input) {
        const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
        if (label && !label.dataset.mphBound) {
          label.dataset.mphBound = '1';
          label.style.cursor = 'pointer';
          label.addEventListener('click', e => { e.preventDefault(); toggle(span); });
        }
      }
    });
  }

  // ============ Inject Blog link into nav ============
  function injectBlogNav() {
    if (location.pathname.startsWith('/blog')) return; // already on blog
    // Find first nav with Contact us link
    const contactLink = document.querySelector('nav a[href="/contact-us"], nav a[href="/contact-us/"]');
    if (!contactLink) return;
    const li = contactLink.closest('li');
    if (!li || document.getElementById('mph-blog-nav')) return;
    const newLi = li.cloneNode(true);
    newLi.id = 'mph-blog-nav';
    const a = newLi.querySelector('a');
    a.setAttribute('href', '/blog/');
    a.textContent = T('Blog', 'Ratgeber');
    li.parentNode.insertBefore(newLi, li);
  }

  // ============ Init ============
  function init() {
    injectSchema();
    injectCookieConsent();
    injectWhatsApp();
    injectStickyCta();
    injectChatWidget();
    injectBlogNav();
    injectFaq();
    fixCheckboxes();
    attachQuoteForm();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Toast animation
  const css = document.createElement('style');
  css.textContent = '@keyframes gdToast{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(css);
})();
