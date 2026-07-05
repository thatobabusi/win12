import { describe, expect, it, beforeEach, vi } from 'vitest';
import $ from 'jquery';

// msstore.js expects the shared desktop.js globals to exist (lang/geticon/pinapp).
// In the real app they come from src/js/desktop.js; here we provide minimal
// stand-ins so the catalog/install logic can be exercised in isolation, and use
// the real jquery package (already a project dependency) so the DOM-rendering
// paths run against genuine jQuery instead of the shared stub in tests/setup.js.
global.$ = $;
global.lang = (fallback) => fallback;
global.geticon = (name) => name + '.svg';
global.pinapp = vi.fn();

import '../../src/js/core/registry.js';
import '../../src/js/apps/msstore.js';

const msstore = window.win12.apps.get('msstore');

function fakeLocalStorage() {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; }
  };
}

describe('apps/msstore (real app catalog + install)', () => {
  beforeEach(() => {
    global.localStorage = fakeLocalStorage();
    global.pinapp.mockClear();
    document.body.innerHTML = `
      <div id="win-msstore">
        <div class="menu"><list><a class="home"></a></list></div>
        <div class="page">
          <div class="cnt home"></div>
          <div class="cnt apps"></div>
          <div class="cnt game"></div>
        </div>
      </div>
      <div id="startmenu-r"><div class="pinned"><div class="apps"></div></div></div>
    `;
  });

  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('msstore')).toBe(true);
    expect(window.apps.msstore).toBe(msstore);
  });

  it('nothing is installed by default', () => {
    expect(msstore.isInstalled('calc')).toBe(false);
  });

  it('install() marks a real catalog app installed and pins it to the Start Menu', () => {
    msstore.install('calc');
    expect(msstore.isInstalled('calc')).toBe(true);
    expect(global.pinapp).toHaveBeenCalledWith('calc', expect.any(String), expect.any(String));
  });

  it('install() is a no-op for an id that is not in the catalog', () => {
    msstore.install('not-a-real-app');
    expect(msstore.isInstalled('not-a-real-app')).toBe(false);
    expect(global.pinapp).not.toHaveBeenCalled();
  });

  it('install() is idempotent — installing twice only pins once', () => {
    msstore.install('calc');
    msstore.install('calc');
    expect(global.pinapp).toHaveBeenCalledTimes(1);
  });

  it('uninstall() reverses install() and removes the pinned Start Menu tile', () => {
    msstore.install('calc');
    $('#startmenu-r>.pinned>.apps').append('<a class="sm-app calc"></a>');
    msstore.uninstall('calc');
    expect(msstore.isInstalled('calc')).toBe(false);
    expect($('#startmenu-r>.pinned>.apps>.sm-app.calc').length).toBe(0);
  });

  it('init() renders both the apps and game catalogs into the DOM', () => {
    msstore.init();
    expect($('#win-msstore>.page>.cnt.apps>div').length).toBeGreaterThan(0);
    expect($('#win-msstore>.page>.cnt.game>div').length).toBeGreaterThan(0);
  });

  it('page() switches the visible catalog page', () => {
    $('#win-msstore>.menu>list').append('<a class="apps"></a>');
    msstore.page('apps');
    expect($('#win-msstore>.page>.cnt.apps').hasClass('show')).toBe(true);
    expect($('#win-msstore>.page>.cnt.home').hasClass('show')).toBe(false);
  });
});
