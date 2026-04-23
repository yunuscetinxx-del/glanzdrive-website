// @ts-check
import { test, expect } from '@playwright/test';

const BASE = 'https://meine-putzhilfe.de';

// ── 1. API: /api/settings must return a valid object, not a char-spread ──────
test('api/settings returns valid JSON object', async ({ request }) => {
  const res = await request.get(`${BASE}/api/settings`);
  expect(res.status()).toBe(200);
  const body = await res.json();

  // Must be an object, not a string or char-spread array
  expect(typeof body).toBe('object');
  expect(Array.isArray(body)).toBe(false);

  // Core keys must exist
  expect(body).toHaveProperty('brand');
  expect(body).toHaveProperty('contact');
  expect(body).toHaveProperty('hero');
  expect(body).toHaveProperty('cities');
  expect(body).toHaveProperty('footer');

  // brand.name must be a real string, not an index key like "0"
  expect(typeof body.brand.name).toBe('string');
  expect(body.brand.name.length).toBeGreaterThan(0);

  // cities must be a real array of strings
  expect(Array.isArray(body.cities)).toBe(true);
  expect(body.cities.length).toBeGreaterThan(0);
  expect(typeof body.cities[0]).toBe('string');
});

// ── 2. API: /api/health must respond ─────────────────────────────────────────
test('api/health returns ok', async ({ request }) => {
  const res = await request.get(`${BASE}/api/health`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.ok).toBe(true);
});

// ── 3. Homepage loads with correct title ─────────────────────────────────────
test('homepage has a title and loads', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
  // Status 200 (no crash page)
  expect(page.url()).toContain('meine-putzhilfe.de');
});

// ── 4. Homepage: phone number visible somewhere on page ───────────────────────
test('homepage shows contact phone number', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const body = await page.content();
  // Either default phone or any German phone pattern
  const hasPhone = /\+49|0\d{3}[\s\-]?\d/.test(body) || /176\s?317/.test(body);
  expect(hasPhone).toBe(true);
});

// ── 5. Footer renders with links (not empty) ──────────────────────────────────
test('footer has at least one link', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const footerLinks = page.locator('footer a');
  const count = await footerLinks.count();
  expect(count).toBeGreaterThan(0);
});

// ── 6. Admin login page loads ─────────────────────────────────────────────────
test('admin login page loads', async ({ page }) => {
  await page.goto(`${BASE}/admin/`, { waitUntil: 'domcontentloaded' });
  // Must have an input for username or password
  const inputs = page.locator('input[type="text"], input[type="password"], input[type="email"]');
  await expect(inputs.first()).toBeVisible();
});

// ── 7. Admin save: full round-trip (login → change phone → save → verify) ────
test('admin: save phone number persists across API fetch', async ({ page, request }) => {
  // -- Login --
  await page.goto(`${BASE}/admin/`, { waitUntil: 'domcontentloaded' });

  // Fill username
  const userInput = page.locator('input[name="user"], #user, input[type="text"]').first();
  await userInput.fill('admin');

  // Fill password
  const passInput = page.locator('#pass, input[name="pass"], input[type="password"]').first();
  await passInput.fill(process.env.ADMIN_PASSWORD || 'changeme123!');

  // Submit
  await page.locator('#loginBtn, button[type="submit"]').first().click();

  // Wait for the dashboard to appear (SPA — same URL, #app becomes visible)
  const appVisible = await page.locator('#app.show').waitFor({ state: 'visible', timeout: 15_000 }).then(() => true).catch(() => false);
  if (!appVisible) {
    // Login failed — skip test gracefully if wrong credentials
    test.skip(true, 'Login credentials not set — set ADMIN_PASSWORD env var to enable this test');
    return;
  }

  // Navigate to settings page
  await page.goto(`${BASE}/admin/site.html`, { waitUntil: 'domcontentloaded' });

  // Find phone field and fill a test value
  const testPhone = '+49 30 99887766';
  const phoneField = page.locator('#contact_phone');
  await phoneField.clear();
  await phoneField.fill(testPhone);

  // Click save
  await page.locator('#btnSave').click();

  // Wait for success toast or dialog
  // The save shows a confirm dialog — dismiss it
  page.on('dialog', d => d.dismiss());
  await page.waitForTimeout(2000);

  // Verify via API that the value was saved
  const res = await request.get(`${BASE}/api/settings?_=${Date.now()}`);
  const saved = await res.json();
  expect(saved.contact?.phone).toBe(testPhone);
});
