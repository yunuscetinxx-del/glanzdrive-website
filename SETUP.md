# Meine Putzhilfe — Setup Guide

## 🔐 Environment Variables (Vercel Dashboard → Settings → Environment Variables)

### Required for full functionality:

| Variable | Purpose | Example |
|----------|---------|---------|
| `ADMIN_USER` | Dashboard login username | `admin` |
| `ADMIN_PASSWORD` | Dashboard login password (use a strong one!) | `Str0ng!Pass#2026` |
| `JWT_SECRET` | Secret for session tokens (random 32+ chars) | `openssl rand -hex 32` |

### For persistent message storage (recommended):

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | From [Upstash.com](https://upstash.com) free Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Same dashboard |

> Without Upstash, messages are stored in-memory and **lost on serverless cold start**. For production you MUST add Upstash (free tier: 10K commands/day).

### Optional Telegram notifications (instant alerts on phone):

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | Your Telegram user/group ID |

### Update site config (in `js/site-bundle.js` line 5):

```js
const MPH_CONFIG = {
  whatsappNumber: '491234567890', // ← REPLACE: international format, no +
  ga4Id: '',                       // ← Add 'G-XXXXXXXXXX' for analytics
  trustpilotBusinessUnit: '',      // ← Add Trustpilot ID
  // ...
};
```

## 📋 Admin Panel

- URL: `https://yoursite.com/admin`
- Default credentials (CHANGE THESE!): `admin` / `changeme123!`

## 🛡️ Security Features

- **CSP** (Content Security Policy) — blocks XSS
- **HSTS** — forces HTTPS for 2 years
- **X-Frame-Options: SAMEORIGIN** — anti-clickjacking
- **Honeypot fields** in forms — anti-bot
- **Rate limiting** — 5 requests/min per IP
- **Spam keyword filter** + URL flood detection
- **Bad bot blocking** in robots.txt (Semrush, Ahrefs, etc.)
- **Wordpress path redirects** (`/wp-admin` → `/`) — discourages bot scans
- **HMAC session tokens** with expiry

## 🇩🇪 Legal Compliance (DSGVO/GDPR)

- ✅ `/impressum` — § 5 TMG legal notice (EDIT placeholders!)
- ✅ `/datenschutz` — DSGVO privacy policy
- ✅ Cookie consent banner with essential/all choice
- ✅ IP anonymization in GA4
- ✅ All footers link to Impressum + Datenschutz

> ⚠️ **Action required:** Open `/impressum/index.html` and replace `[Name eintragen]`, `[USt-IdNr.]`, etc.

## 🚀 Deploy

Already set up: GitHub `master` branch auto-deploys on Vercel.

```bash
git add .
git commit -m "Update"
git push origin master
```
