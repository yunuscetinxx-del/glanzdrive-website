// === MAINTENANCE MODE === 
// Remove or delete this file to restore the website
(function() {
  var overlay = document.createElement('div');
  overlay.id = 'maintenance-overlay';
  overlay.innerHTML = `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1f2a2e 0%,#2a3a40 50%,#1f2a2e 100%);color:#fff;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:40px 20px;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;">
        <div style="position:absolute;top:10%;left:5%;width:300px;height:300px;background:rgba(114,222,255,0.05);border-radius:50%;filter:blur(80px);"></div>
        <div style="position:absolute;bottom:10%;right:5%;width:400px;height:400px;background:rgba(114,222,255,0.03);border-radius:50%;filter:blur(100px);"></div>
      </div>
      <div style="position:relative;z-index:1;max-width:600px;">
        <img src="/images/logo/logo-brand.png" alt="GlanzDrive" style="height:100px;width:auto;margin-bottom:40px;object-fit:contain;" />
        <div style="margin-bottom:30px;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#72deff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h1 style="font-size:2.5rem;font-weight:800;margin:0 0 12px;letter-spacing:-0.5px;color:#72deff;">
          Website Under Maintenance
        </h1>
        <h2 style="font-size:1.5rem;font-weight:600;margin:0 0 24px;color:#72deff;opacity:0.8;">
          Webseite wird gewartet
        </h2>
        <p style="font-size:1.15rem;line-height:1.7;color:rgba(255,255,255,0.8);margin:0 0 10px;">
          We are currently performing scheduled maintenance.<br/>
          We'll be back online shortly.
        </p>
        <p style="font-size:1rem;line-height:1.7;color:rgba(255,255,255,0.6);margin:0 0 40px;">
          Wir führen derzeit geplante Wartungsarbeiten durch.<br/>
          Wir sind in Kürze wieder online.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-bottom:40px;">
          <a href="mailto:support@glanzdrive.com" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:#72deff;color:#1f2a2e;border-radius:8px;font-weight:700;text-decoration:none;font-size:0.95rem;transition:opacity 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            support@glanzdrive.com
          </a>
          <a href="tel:+10239310" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:transparent;color:#72deff;border:2px solid #72deff;border-radius:8px;font-weight:700;text-decoration:none;font-size:0.95rem;transition:opacity 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.84 1.18A2 2 0 012.84.84H6a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +1 0239 0310
          </a>
        </div>
        <p style="font-size:0.85rem;color:rgba(255,255,255,0.35);">© 2026 GlanzDrive</p>
      </div>
    </div>
  `;
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;overflow-y:auto;';
  
  // Hide everything and show maintenance
  document.addEventListener('DOMContentLoaded', function() {
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
  });
  
  // If DOM already loaded
  if (document.readyState !== 'loading') {
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
  }
})();
