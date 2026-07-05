import { describe, expect, it, beforeEach } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/setting.js';

const setting = window.win12.apps.get('setting');

beforeEach(() => {
  window.lang = (txt) => txt;
  // Chainable jQuery stub covering every call in checkUpdate's/autostart's/
  // theme_get's/theme_set_local's web branch.
  window.$ = () => {
    const o = {
      find: () => o, text: () => o, addClass: () => o, removeClass: () => o,
      removeAttr: () => o, attr: () => o, html: () => o, click: () => o, scrollTop: () => o,
      hasClass: () => false, css: () => o, remove: () => o,
    };
    return o;
  };
  delete window.win12Native; // simulate the web (non-Tauri) build
});

describe('apps/setting (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('setting')).toBe(true);
    expect(window.apps.setting).toBe(setting);
  });

  it('exposes the expected controller surface', () => {
    ['init', 'page', 'theme_get', 'theme_set', 'theme_set_local', 'checkUpdate', 'initAutostart', 'toggleAutostart']
      .forEach((m) => expect(typeof setting[m]).toBe('function'));
  });

  it('theme_set_local is a no-op for an unknown id (no throw)', () => {
    expect(() => setting.theme_set_local('does-not-exist')).not.toThrow();
  });

  it('theme_set_local applies the bundled Ubuntu palette without throwing', () => {
    expect(() => setting.theme_set_local('ubuntu')).not.toThrow();
  });

  it('theme_set_local persists the choice so it survives reloads', () => {
    // tests/setup.js replaces localStorage with no-op vi.fn() mocks; install a
    // real map-backed fake (same pattern as apps-msstore.test.js).
    let store = {};
    global.localStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; },
    };
    setting.theme_set_local('ubuntu');
    expect(localStorage.getItem('localTheme')).toBe('ubuntu');
    // unknown ids must not clobber the stored choice
    setting.theme_set_local('does-not-exist');
    expect(localStorage.getItem('localTheme')).toBe('ubuntu');
  });

  it('checkUpdate stays inert (no throw) on the web build', async () => {
    await expect(setting.checkUpdate()).resolves.toBeUndefined();
  });

  it('initAutostart stays inert (no throw) on the web build', async () => {
    await expect(setting.initAutostart()).resolves.toBeUndefined();
  });

  it('toggleAutostart stays inert (no throw) on the web build', async () => {
    await expect(setting.toggleAutostart()).resolves.toBeUndefined();
  });
});
