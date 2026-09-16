/** Apply before paint, then progressively enhance the native preference control. */
(() => {
  const key = 'dwc-theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const normalize = value => ['light', 'dark'].includes(value) ? value : 'system';
  let preference = 'system';
  try { preference = normalize(window.localStorage.getItem(key)); } catch { /* Private storage still permits an in-memory choice. */ }
  const apply = () => {
    const resolved = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolved;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = resolved === 'dark' ? '#0a0d1a' : '#f8fafc';
    });
    document.querySelectorAll('[data-theme-control]').forEach(control => { control.value = preference; });
  };
  apply();
  media.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { preference = normalize(event.newValue); apply(); }
  });
  document.addEventListener('change', event => {
    if (!event.target.matches?.('[data-theme-control]')) return;
    preference = normalize(event.target.value);
    try { window.localStorage.setItem(key, preference); } catch { /* Keep working without persistence. */ }
    apply();
  });
  const enhance = () => {
    apply();
    document.querySelectorAll('[data-theme-picker]').forEach(picker => { picker.hidden = false; });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, { once: true });
  else enhance();
})();
