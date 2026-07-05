import { describe, expect, it, beforeEach } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/setting.js';

const setting = window.win12.apps.get('setting');

beforeEach(() => {
  window.lang = (txt) => txt;
  // Chainable jQuery stub covering every call in checkUpdate's web branch.
  window.$ = () => {
    const o = {
      find: () => o, text: () => o, addClass: () => o, removeClass: () => o,
      removeAttr: () => o, attr: () => o, html: () => o, click: () => o, scrollTop: () => o,
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
    ['init', 'page', 'theme_get', 'theme_set', 'checkUpdate']
      .forEach((m) => expect(typeof setting[m]).toBe('function'));
  });

  it('checkUpdate stays inert (no throw) on the web build', async () => {
    await expect(setting.checkUpdate()).resolves.toBeUndefined();
  });
});
