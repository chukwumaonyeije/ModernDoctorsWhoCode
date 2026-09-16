import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const script = readFileSync(new URL('../src/scripts/theme.js', import.meta.url), 'utf8');
function browser({ stored = null, dark = false, denied = false } = {}) {
  const events = {}, windowEvents = {}, mediaEvents = {};
  const control = { value: '', matches: selector => selector === '[data-theme-control]' };
  const picker = { hidden: true }, meta = {}, root = { dataset: {}, style: {} };
  const media = { matches: dark, addEventListener: (name, fn) => { mediaEvents[name] = fn; } };
  const storage = { getItem: () => { if (denied) throw Error('Denied'); return stored; }, setItem: (_, value) => { if (denied) throw Error('Denied'); stored = value; } };
  const document = { documentElement: root, readyState: 'loading', querySelector: () => meta,
    querySelectorAll: selector => selector === '[data-theme-control]' ? [control] : selector === '[data-theme-picker]' ? [picker] : [meta],
    addEventListener: (name, fn) => { events[name] = fn; } };
  const window = { localStorage: storage, matchMedia: () => media, addEventListener: (name, fn) => { windowEvents[name] = fn; } };
  vm.runInNewContext(script, { window, document });
  return { root, control, picker, meta, ready: () => events.DOMContentLoaded(),
    choose: value => { control.value = value; events.change({ target: control }); },
    system: value => { media.matches = value; mediaEvents.change(); },
    storage: (value, key = 'dwc-theme') => windowEvents.storage({ key, newValue: value }),
    stored: () => stored };
}
test('system preference applies before DOM readiness, then updates the native control', () => {
  const page = browser({ dark: true });
  assert.equal(page.root.dataset.theme, 'dark'); assert.equal(page.picker.hidden, true);
  page.ready(); assert.equal(page.picker.hidden, false); assert.equal(page.control.value, 'system');
  page.system(false); assert.equal(page.root.dataset.theme, 'light'); assert.equal(page.meta.content, '#f8fafc');
});
test('explicit choices survive OS changes and system restores live tracking', () => {
  const page = browser({ stored: 'dark' }); page.ready();
  page.system(false); assert.equal(page.root.dataset.theme, 'dark');
  page.choose('light'); page.system(true); assert.equal(page.root.dataset.theme, 'light'); assert.equal(page.stored(), 'light');
  page.choose('system'); assert.equal(page.root.dataset.theme, 'dark'); assert.equal(page.control.value, 'system');
});
test('corrupt or unavailable storage falls back safely and remains usable', () => {
  const invalid = browser({ stored: 'broken', dark: true }); assert.equal(invalid.root.dataset.theme, 'dark');
  const denied = browser({ denied: true }); denied.ready(); denied.choose('dark'); assert.equal(denied.root.dataset.theme, 'dark');
  denied.system(false); assert.equal(denied.root.dataset.theme, 'dark');
});
test('cross-tab changes and clearing storage synchronize the preference', () => {
  const page = browser({ stored: 'dark' }); page.ready();
  page.storage('light'); assert.equal(page.control.value, 'light');
  page.storage(null, null); assert.equal(page.control.value, 'system');
  page.system(true); assert.equal(page.root.dataset.theme, 'dark');
  page.storage('light', 'unrelated'); assert.equal(page.root.dataset.theme, 'dark');
});
test('both palettes meet text and control-border contrast against base surfaces', () => {
  const css = readFileSync(new URL('../src/styles/theme.css', import.meta.url), 'utf8');
  const luminance = hex => { const v = hex.slice(1).match(/../g).map(c => parseInt(c,16)/255).map(c => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4); return v[0]*0.2126+v[1]*0.7152+v[2]*0.0722; };
  const ratio = (a,b) => (Math.max(luminance(a),luminance(b))+0.05)/(Math.min(luminance(a),luminance(b))+0.05);
  const palettes = [...css.matchAll(/:root(?:\[data-theme="dark"\])?\s*\{([^}]+)\}/g)];
  assert.equal(palettes.length, 2);
  for (const block of palettes) {
    const colors = Object.fromEntries([...block[1].matchAll(/--color-([a-z-]+): (#[0-9a-f]{6});/g)].map(m => [m[1],m[2]]));
    for (const surface of ['background','surface']) {
      for (const token of ['text','muted','accent','link-hover','purple','success','warning']) assert.ok(ratio(colors[token],colors[surface])>=4.5, `${token} on ${surface}`);
      assert.ok(ratio(colors.border,colors[surface])>=3, `border on ${surface}`);
    }
  }
});
