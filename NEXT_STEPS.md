# 📋 الخطوات التالية - Meine Putzhilfe

> آخر تحديث: 22 April 2026
> الموقع شغال على: https://meine-putzhilfe.de

---

## ✅ ما تم إنجازه

- [x] الموقع مرفوع على Hostinger ويعمل (HTTP 200)
- [x] الـ 11 دومين مربوطة + 10 منهم يعملون 301 redirect مع UTM
- [x] SSL Let's Encrypt على كل الدومينات
- [x] البلوج + 5 مقالات ألمانية (`/blog/`)
- [x] Impressum + Datenschutz بالألمانية حسب DSGVO
- [x] Sitemap + robots.txt محدّثة
- [x] Rebrand كامل (GlanzDrive → Meine Putzhilfe)

---

## 🔥 المهام العاجلة (الأسبوع الأول)

### 1. Google Search Console (الأهم!)
- [ ] سجّل في https://search.google.com/search-console
- [ ] أضف property: `https://meine-putzhilfe.de` → تحقق عبر DNS TXT
- [ ] أرسل sitemap: `sitemap.xml`
- [ ] أضف الـ 10 دومينات الباقية كـ properties منفصلة
  - putzretter.de, glanzretter.de, putzkonig.de, glanzkonig.de
  - glanzstar.de, putzhof.de, putzheim.de
  - putzcity.de, glanzcity.de, glanzland.de
- [ ] في Settings → Change of address → ربط كل دومين redirect → meine-putzhilfe.de

### 2. Bing Webmaster Tools
- [ ] https://www.bing.com/webmasters → نفس الخطوات
- [ ] Bing = ~10% من الترافيك الألماني

### 3. Google Business Profile (محلي)
- [ ] https://business.google.com → "Meine Putzhilfe"
- [ ] أضف العنوان الحقيقي + رقم WhatsApp + ساعات العمل
- [ ] رفع 5+ صور (شعار، صور خدمات، فريق العمل)
- [ ] هذا يجلب ~40% من العملاء المحليين!

### 4. بريد رسمي
- [ ] hPanel → Emails → Free Email Service
- [ ] أنشئ: `kontakt@meine-putzhilfe.de`
- [ ] (اختياري) `info@`, `support@`

---

## 📝 المعلومات الناقصة (أرسلها لـ Copilot ليعدل الملفات)

```
- رقم WhatsApp الحقيقي:    _________________
- رقم الهاتف:               _________________
- العنوان (شارع + رقم):     _________________
- PLZ + المدينة:            _________________
- اسم المالك (Inhaber):     _________________
- USt-IdNr:                 _________________ (أو "Kleinunternehmer §19 UStG")
- GA4 Measurement ID:       G-_______________
- Trustpilot Business ID:   _________________ (لو موجود)
```

**الملفات اللي تحتاج تعديل بعد الحصول على المعلومات:**
- `js/site-bundle.js` (السطر 4-12: MPH_CONFIG)
- `impressum/index.html` (الحقول `[بين قوسين]`)
- `datenschutz/index.html` (Verantwortlicher)

---

## 🚀 تحسينات SEO (الأسبوع الثاني-الرابع)

### 5. Google Analytics 4
- [ ] https://analytics.google.com → Create Property
- [ ] خذ Measurement ID وأضفه في `site-bundle.js`
- [ ] فعّل Enhanced Measurements
- [ ] اربط مع Search Console

### 6. صفحات مدن (Local SEO قوي)
- [ ] `/berlin/` - "Putzhilfe Berlin"
- [ ] `/munchen/` - "Putzhilfe München"
- [ ] `/hamburg/` - "Putzhilfe Hamburg"
- [ ] `/koln/` - "Putzhilfe Köln"
- [ ] `/frankfurt/` - "Putzhilfe Frankfurt"
- [ ] كل صفحة: 800+ كلمة + Schema LocalBusiness + شهادات + أسعار محلية

### 7. مقالات بلوج إضافية (5 مقالات)
أفكار مواضيع Google Trends:
- [ ] "Frühjahrsputz Checkliste 2026"
- [ ] "Fenster putzen ohne Streifen - 7 Profi-Tricks"
- [ ] "Schimmel im Bad entfernen - Anleitung"
- [ ] "Büroreinigung outsourcen - lohnt sich das?"
- [ ] "Putzhilfe für Senioren - was beachten?"

### 8. FAQ Schema على الرئيسية
- [ ] إضافة 8-10 أسئلة شائعة + JSON-LD FAQPage
- [ ] يظهر كصناديق توسع في نتائج Google

### 9. Trustpilot
- [ ] سجل في https://business.trustpilot.com
- [ ] أضف Business Unit ID في `site-bundle.js`
- [ ] اطلب تقييمات من أول 10 عملاء

---

## 🛠️ تحسينات تقنية

### 10. Upstash Redis (الرسائل الدائمة)
- [ ] https://upstash.com → Create Redis DB (Free tier)
- [ ] في hPanel → Node.js app → Environment Variables، أضف:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- [ ] اطلب من Copilot تعديل `api/_utils.js` لاستخدام Redis بدلاً من الذاكرة
- [ ] (الآن: الرسائل تختفي عند restart السيرفر)

### 11. Backup يومي
- [ ] hPanel → Backups → Enable daily backup
- [ ] احفظ نسخة محلية كل أسبوع: `git pull`

### 12. Performance Monitoring
- [ ] https://pagespeed.web.dev → اختبر `meine-putzhilfe.de`
- [ ] هدف: 90+ في Mobile + Desktop
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms

---

## 💰 التسويق (الأسبوع الرابع+)

### 13. Google Ads
- [ ] حملة "Putzhilfe + [اسم مدينتك]"
- [ ] ميزانية اقتراحية: 10-20 EUR/يوم للبداية
- [ ] استهدف keywords:
  - "putzhilfe in der nähe"
  - "reinigungsfirma [مدينة]"
  - "endreinigung wohnung"

### 14. Backlinks محلية
- [ ] سجل في:
  - https://www.gelbeseiten.de
  - https://www.dasoertliche.de
  - https://www.11880.com
  - https://www.cylex.de
- [ ] **مهم:** نفس NAP (Name, Address, Phone) في كل مكان!

### 15. Social Media
- [ ] Instagram: @meineputzhilfe
- [ ] Facebook Business Page
- [ ] TikTok (قصير، فيديوهات قبل/بعد التنظيف)

---

## 📊 مراجعة الأداء (شهرياً)

### بعد شهر:
- [ ] Search Console → كم impression لكل دومين؟
- [ ] Analytics → أي UTM source يجلب أكثر زيارات؟
  - putzretter, glanzretter, putzkonig, etc.
- [ ] **القرار:** الدومينات الضعيفة → أوقف auto-renewal بعد سنة
  (hPanel → Billing → Subscriptions → Disable auto-renew)

### بعد 3 شهور:
- [ ] أي مقال بلوج يجلب أكثر زوار؟ → اكتب 3 مقالات مشابهة
- [ ] أي صفحة مدينة الأقوى؟ → ركز Google Ads عليها
- [ ] أرسل طلب Backlinks للجرائد المحلية

---

## ⚠️ تذكيرات مهمة

- 🔐 **JWT_SECRET + ADMIN_PASSWORD**: محفوظين في Hostinger ENV — لا تنسهم!
- 🌐 **API Token Hostinger**: الذي شاركته معي — تأكد إنك غيّرته بعد ما خلصنا
- 📧 **Telegram Notifications**: لو تبي إشعارات فورية للرسائل، أضف:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- 🔄 **Auto-deploy**: أي push على `master` → ينشر تلقائياً

---

## 📞 ملفات مهمة في المشروع

| الملف | الوصف |
|---|---|
| `server.js` | Express + multi-domain redirects |
| `js/site-bundle.js` | الإعدادات الرئيسية (config + JSON-LD) |
| `js/translations.js` | i18n (EN/DE) |
| `api/_utils.js` | Auth + rate limit + sanitize |
| `api/quote.js` | استقبال طلبات العروض |
| `admin/index.html` | لوحة الإدارة |
| `blog/` | المقالات الألمانية |
| `impressum/`, `datenschutz/` | الصفحات القانونية |

---

**رابط Admin Dashboard:** https://meine-putzhilfe.de/admin/
- Username: من ENV `ADMIN_USER`
- Password: من ENV `ADMIN_PASSWORD`
