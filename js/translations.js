// === Meine Putzhilfe i18n + SEO ===
// Auto-detects browser language, supports ?lang=de URL param, persists to localStorage
// Translates body text, attributes, <title>, meta description; injects hreflang/og:locale SEO tags
const TRANSLATIONS = {
  // Navigation
  "Home": "Startseite",
  "About us": "Über uns",
  "Services": "Dienstleistungen",
  "Contact us": "Kontakt",
  "Docs": "Dokumente",
  "Documentation": "Dokumentation",
  "Book a service": "Service buchen",

  // Banner
  "Meine Putzhilfe Reinigung": "Meine Putzhilfe Reinigung",
  "Trusted Residential Cleaning Services": "Vertrauenswürdige Reinigungsdienste für Ihr Zuhause",
  "Enjoy a pristine home with our expert cleaning services. Book now for a cleaner, fresher living space.": "Genießen Sie ein makelloses Zuhause mit unseren professionellen Reinigungsdiensten. Buchen Sie jetzt für ein saubereres, frischeres Wohnambiente.",

  // Quote form
  "Get a free quote": "Kostenloses Angebot anfordern",
  "Full name *": "Vollständiger Name *",
  "Phone number *": "Telefonnummer *",
  "Email address *": "E-Mail-Adresse *",
  "Service options *": "Serviceoptionen *",
  "Regular Cleaning": "Regelmäßige Reinigung",
  "Deep Cleaning": "Grundreinigung",
  "Move-in / Move-out": "Ein-/Auszugsreinigung",
  "Removal & Storage": "Umzug & Lagerung",
  "Eco Cleaning": "Öko-Reinigung",
  "Renovation Cleaning": "Renovierungsreinigung",
  "Get started today": "Jetzt starten",

  // Marquee
  "Special discounts available for recurring cleaning services!": "Sonderrabatte für regelmäßige Reinigungsdienste!",
  "Free estimates! Contact us today to schedule your cleaning!": "Kostenlose Schätzungen! Kontaktieren Sie uns noch heute!",
  "Eco-friendly products for a healthier home environment!": "Umweltfreundliche Produkte für ein gesünderes Zuhause!",
  "Book now and get 10% off your first cleaning service!": "Jetzt buchen und 10% Rabatt auf Ihre erste Reinigung!",
  "Explore our efficient cleaning services designed!": "Entdecken Sie unsere effizienten Reinigungsdienste!",

  // Services section
  "Your home, our priority": "Ihr Zuhause, unsere Priorität",
  "Our Professional Cleaning Services": "Unsere professionellen Reinigungsdienste",
  "Explore our efficient cleaning services designed to maintain a neat and tidy home environment.": "Entdecken Sie unsere effizienten Reinigungsdienste, die für ein sauberes und ordentliches Zuhause sorgen.",
  "View all services": "Alle Dienstleistungen anzeigen",

  // Cleaning highlights
  "Let us make your home shine & spotless": "Lassen Sie Ihr Zuhause glänzen und makellos erstrahlen",
  "The desks are polished and dust-free, the carpets are fresh and spotless.": "Die Oberflächen sind poliert und staubfrei, die Teppiche sind frisch und makellos.",
  "Cleaning for allergy relief": "Reinigung für Allergiker",
  "Residential deep cleaning": "Gründliche Wohnungsreinigung",
  "Seasonal cleaning": "Saisonale Reinigung",
  "Customized cleaning plans": "Individuelle Reinigungspläne",
  "Contact Us": "Kontaktieren Sie uns",

  // Why choose us
  "Why choose us?": "Warum uns wählen?",
  "Exceptional service every time": "Erstklassiger Service – jedes Mal",
  "Our team is highly trained and experienced, ensuring thorough and professional cleaning every time.": "Unser Team ist bestens geschult und erfahren und sorgt jedes Mal für eine gründliche und professionelle Reinigung.",
  "We offer tailored cleaning plans to meet your specific needs.": "Wir bieten maßgeschneiderte Reinigungspläne, die Ihren speziellen Bedürfnissen entsprechen.",
  "We use eco-friendly cleaning products that are safe for your family and pets.": "Wir verwenden umweltfreundliche Reinigungsprodukte, die für Ihre Familie und Haustiere sicher sind.",
  "We provide flexible scheduling to fit your busy lifestyle.": "Wir bieten flexible Terminplanung, die zu Ihrem vollen Terminkalender passt.",
  "Our satisfaction guarantee ensures you'll be happy with our service, or we'll make it right.": "Unsere Zufriedenheitsgarantie stellt sicher, dass Sie mit unserem Service zufrieden sind – oder wir machen es richtig.",

  // Testimonials
  "What our clients say": "Was unsere Kunden sagen",
  "Feedback from satisfied customers.": "Feedback zufriedener Kunden.",
  "Gain insight into how our cleaning services have transformed homes and exceeded expectations.": "Erfahren Sie, wie unsere Reinigungsdienste Häuser verwandelt und Erwartungen übertroffen haben.",
  "\"Meine Putzhilfe transformed my home! Highly recommend their attention to detail.\"": "\"Meine Putzhilfe hat mein Zuhause verwandelt! Ich empfehle ihre Liebe zum Detail wärmstens.\"",
  "I'm consistently impressed by the professionalism and thoroughness of Meine Putzhilfe's team. My house has never looked better!": "Ich bin immer wieder beeindruckt von der Professionalität und Gründlichkeit des Meine Putzhilfe-Teams. Mein Haus sah noch nie so gut aus!",
  "I appreciate the flexibility and reliability of Meine Putzhilfe's services. They always go above and beyond to exceed my expectations!": "Ich schätze die Flexibilität und Zuverlässigkeit der Meine Putzhilfe-Dienste. Sie übertreffen stets meine Erwartungen!",

  // Pricing
  "Transparent pricing": "Transparente Preise",
  "Budget-friendly options for a cleaner home": "Budgetfreundliche Optionen für ein sauberes Zuhause",
  "Essential cleaning to keep your home fresh, tidy, and inviting.": "Grundreinigung, um Ihr Zuhause frisch, ordentlich und einladend zu halten.",
  "Thorough cleaning for a spotless, sparkling home.": "Gründliche Reinigung für ein makelloses, glänzendes Zuhause.",
  "Consistent cleaning to maintain a pristine, comfortable home.": "Regelmäßige Reinigung für ein makelloses, komfortables Zuhause.",
  "Comprehensive cleaning for special occasions and seasonal refreshes.": "Umfassende Reinigung für besondere Anlässe und saisonale Auffrischung.",
  "Book a services": "Service buchen",

  // Our work
  "Our work in action": "Unsere Arbeit in Aktion",
  "See the difference we make": "Sehen Sie den Unterschied",

  // Stats
  "People who have started cleaning": "Menschen, die mit der Reinigung begonnen haben",
  "cleaning": "Reinigung",
  "Cleaning services in England cater to a wide range of needs from residential.": "Reinigungsdienste decken ein breites Spektrum an Bedürfnissen im Wohnbereich ab.",

  // Footer
  "Stay updated with the latest news, promotions, and exclusive offers.": "Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten, Aktionen und exklusiven Angeboten.",
  "Enter your email": "E-Mail eingeben",
  "Subscribe": "Abonnieren",
  "By subscribing, you agree to receive our promotional emails. You can unsubscribe at any time.": "Mit dem Abonnement stimmen Sie dem Erhalt unserer Werbe-E-Mails zu. Sie können sich jederzeit abmelden.",
  "A cleaner home is just a call away - start your journey today.": "Ein sauberes Zuhause ist nur einen Anruf entfernt – starten Sie noch heute.",
  "Pricing plans": "Preispläne",
  "404 Page": "404 Seite",
  "Terms of service": "Nutzungsbedingungen",
  "Privacy policy": "Datenschutzrichtlinie",
  "Get a quote": "Angebot anfordern",

  // Misc
  "About Us": "Über uns",
  "Who we are": "Wer wir sind",
  "All Services": "Alle Dienstleistungen",
  "Get in Touch": "Kontakt aufnehmen",
  "Learn more": "Mehr erfahren",
  "Read more": "Weiterlesen",
  "Submit": "Absenden",
  "Send": "Senden",
  "Close": "Schließen",
  "Open": "Öffnen",
  "Back": "Zurück",
  "Next": "Weiter",
  "Previous": "Zurück",
};

// Page-level SEO translations
const SEO_TITLES = {
  "Meine Putzhilfe": "Meine Putzhilfe – Professionelle Reinigungsdienste",
  "About us | Meine Putzhilfe": "Über uns | Meine Putzhilfe",
  "Services | Meine Putzhilfe": "Dienstleistungen | Meine Putzhilfe",
  "Services detail | Meine Putzhilfe": "Service-Details | Meine Putzhilfe",
  "Contact us | Meine Putzhilfe": "Kontakt | Meine Putzhilfe",
  "Documentation — Meine Putzhilfe": "Dokumentation — Meine Putzhilfe Reinigungsdienste",
  "Privacy-Policy | Meine Putzhilfe": "Datenschutzrichtlinie | Meine Putzhilfe",
  "Terms & Condition | Meine Putzhilfe": "Nutzungsbedingungen | Meine Putzhilfe",
};

const SEO_DESCRIPTIONS = {
  "Meine Putzhilfe - homepage": "Meine Putzhilfe – Vertrauenswürdige Reinigungsdienste für Ihr Zuhause. Regelmäßige Reinigung, Grundreinigung, Ein-/Auszugsreinigung und mehr. Jetzt kostenloses Angebot anfordern.",
};

(function () {
  const LANG_KEY = 'meine-putzhilfe-lang';
  const SUPPORTED = ['en', 'de'];

  // Reverse map (de -> en)
  const REVERSE = {};
  for (const [en, de] of Object.entries(TRANSLATIONS)) REVERSE[de] = en;

  function detectLang() {
    try {
      const p = new URL(window.location.href).searchParams.get('lang');
      if (p && SUPPORTED.includes(p)) return p;
    } catch (e) {}
    // Only honor stored lang if user explicitly toggled (we mark with version flag)
    try {
      const stored = localStorage.getItem(LANG_KEY);
      const userSet = localStorage.getItem(LANG_KEY + '-user');
      if (stored && userSet === '1' && SUPPORTED.includes(stored)) return stored;
    } catch (e) {}
    // Default = German (primary market). Browser-language detection disabled
    // because the site is German-first; English visitors can switch via the toggle.
    return 'de';
  }

  function setStoredLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function translateNode(node, lang) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (!text) return;
      if (lang === 'de') {
        if (TRANSLATIONS[text]) {
          if (!node._origText) node._origText = node.textContent;
          node.textContent = node.textContent.replace(text, TRANSLATIONS[text]);
        }
      } else {
        if (node._origText) {
          node.textContent = node._origText;
        } else if (REVERSE[text]) {
          node.textContent = node.textContent.replace(text, REVERSE[text]);
        }
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
    ['placeholder', 'title', 'aria-label'].forEach(attr => {
      const v = node.getAttribute && node.getAttribute(attr);
      if (!v) return;
      const trimmed = v.trim();
      const cacheKey = '_orig_' + attr;
      if (lang === 'de' && TRANSLATIONS[trimmed]) {
        if (!node[cacheKey]) node[cacheKey] = v;
        node.setAttribute(attr, TRANSLATIONS[trimmed]);
      } else if (lang === 'en' && node[cacheKey]) {
        node.setAttribute(attr, node[cacheKey]);
      }
    });
    if (tag === 'INPUT' && (node.type === 'submit' || node.type === 'button') && node.value) {
      const v = node.value.trim();
      if (lang === 'de' && TRANSLATIONS[v]) {
        if (!node._origValue) node._origValue = node.value;
        node.value = TRANSLATIONS[v];
      } else if (lang === 'en' && node._origValue) {
        node.value = node._origValue;
      }
    }
    for (let child of node.childNodes) translateNode(child, lang);
  }

  function updateSEO(lang) {
    document.documentElement.lang = lang;
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const orig = titleEl.dataset.origTitle || titleEl.textContent;
      titleEl.dataset.origTitle = orig;
      titleEl.textContent = (lang === 'de' && SEO_TITLES[orig]) ? SEO_TITLES[orig] : orig;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const orig = metaDesc.dataset.origContent || metaDesc.getAttribute('content');
      metaDesc.dataset.origContent = orig;
      metaDesc.setAttribute('content', (lang === 'de' && SEO_DESCRIPTIONS[orig]) ? SEO_DESCRIPTIONS[orig] : orig);
    }
    function ensureMeta(prop, content) {
      let el = document.querySelector('meta[property="' + prop + '"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }
    ensureMeta('og:locale', lang === 'de' ? 'de_DE' : 'en_US');
    ensureMeta('og:locale:alternate', lang === 'de' ? 'en_US' : 'de_DE');
    if (!document.querySelector('link[rel="alternate"][hreflang]')) {
      const baseUrl = window.location.origin + window.location.pathname;
      [['en', baseUrl + '?lang=en'], ['de', baseUrl + '?lang=de'], ['x-default', baseUrl]].forEach(([hl, href]) => {
        const link = document.createElement('link');
        link.rel = 'alternate'; link.hreflang = hl; link.href = href;
        document.head.appendChild(link);
      });
    }
  }

  function injectNavToggle() {
    if (document.getElementById('mph-lang-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'mph-lang-btn';
    btn.className = 'lang-toggle-btn';
    btn.type = 'button';
    btn.onclick = toggleLang;
    // Position: desktop = top-right inside header strip (not floating over content);
    // mobile = bottom-left small (away from WhatsApp bottom-right + chat widget)
    btn.style.cssText = [
      'position:fixed',
      'z-index:9997',
      'padding:7px 13px',
      'border-radius:999px',
      'background:#72deff',
      'color:#1f2a2e',
      'border:1.5px solid #1f2a2e',
      'font-weight:800',
      'font-size:12px',
      'cursor:pointer',
      'display:inline-flex',
      'align-items:center',
      'gap:5px',
      'line-height:1',
      'box-shadow:0 3px 10px rgba(0,0,0,.15)',
      'transition:transform .15s ease'
    ].join(';');
    btn.onmouseover = () => btn.style.transform = 'scale(1.06)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg><span class="lang-label">DE</span>';
    document.body.appendChild(btn);

    const mq = window.matchMedia('(max-width: 991px)');
    const place = () => {
      if (mq.matches) {
        // Mobile: bottom-left, smaller, away from WhatsApp (bottom-right)
        btn.style.top = 'auto';
        btn.style.right = 'auto';
        btn.style.bottom = '18px';
        btn.style.left = '18px';
      } else {
        // Desktop: top-right inside the dark top strip area (top:8px keeps it inside header bar)
        btn.style.top = '14px';
        btn.style.right = '18px';
        btn.style.bottom = 'auto';
        btn.style.left = 'auto';
      }
    };
    mq.addEventListener ? mq.addEventListener('change', place) : mq.addListener(place);
    place();
  }
  const injectFloatingToggle = injectNavToggle;

  function updateToggleButtons(lang) {
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      const label = lang === 'de' ? 'EN' : 'DE';
      const labelEl = btn.querySelector('.lang-label');
      if (labelEl) labelEl.textContent = label;
      else btn.textContent = label;
      btn.title = lang === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln';
      btn.setAttribute('aria-label', btn.title);
    });
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    if (document.body) {
      injectFloatingToggle();
      translateNode(document.body, lang);
    }
    updateSEO(lang);
    updateToggleButtons(lang);
  }

  function toggleLang() {
    const current = document.documentElement.lang === 'de' ? 'de' : 'en';
    const next = current === 'en' ? 'de' : 'en';
    setStoredLang(next);
    try { localStorage.setItem(LANG_KEY + '-user', '1'); } catch (e) {}
    applyLang(next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.history.replaceState({}, '', url);
    } catch (e) {}
  }

  window.toggleLang = toggleLang;
  window.applyLang = applyLang;
  window.detectLang = detectLang;

  const initial = detectLang();
  setStoredLang(initial);
  document.documentElement.lang = initial;

  function init() {
    applyLang(initial);
    setTimeout(() => applyLang(initial), 300);
    setTimeout(() => applyLang(initial), 1200);
    setTimeout(() => applyLang(initial), 2500);
    // Observe body for late DOM changes; pause observer during our own writes to avoid loops
    let pending = false;
    let paused = false;
    const reapply = () => {
      paused = true;
      const lang = document.documentElement.lang === 'de' ? 'de' : 'en';
      applyLang(lang);
      // give the browser a frame, then re-enable observer
      setTimeout(() => { paused = false; }, 50);
    };
    const obs = new MutationObserver(() => {
      if (paused || pending) return;
      pending = true;
      setTimeout(() => { pending = false; reapply(); }, 250);
    });
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
