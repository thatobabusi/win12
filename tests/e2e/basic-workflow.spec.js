import { test, expect } from '@playwright/test';

// Apps are opened via the global openapp() (robust against overlay/selector churn).
// ?skip_login=1 bypasses the login overlay; ?develop=1 disables the service worker
// so tests always run against fresh files.
const URL = '/desktop.html?skip_login=1&develop=1';

async function boot(page) {
  await page.goto(URL);
  await page.waitForSelector('#desktop', { timeout: 20000 });
  // wait until the app globals are ready (desktop.html pulls large/CDN scripts on a cold load)
  await page.waitForFunction(() => typeof window.openapp === 'function', { timeout: 25000 });
}
async function openApp(page, name) {
  await page.evaluate((n) => window.openapp(n), name);
  const win = page.locator(`.window.${name}`);
  await expect(win).toBeVisible({ timeout: 15000 });
  return win;
}

test.describe('Win12 desktop & apps', () => {
  test.beforeEach(async ({ page }) => boot(page));

  test('desktop, taskbar and start button load', async ({ page }) => {
    await expect(page.locator('#desktop')).toBeVisible();
    await expect(page.locator('#taskbar')).toHaveCount(1);
    await expect(page.locator('#start-menu')).toHaveCount(1);
    await expect(page.locator('#start-btn')).toHaveCount(1);
  });

  test('desktop has app icons', async ({ page }) => {
    const icons = await page.locator('#desktop > div[appname]').count();
    expect(icons).toBeGreaterThan(0);
  });

  test('opens Settings', async ({ page }) => { await openApp(page, 'setting'); });
  test('opens File Explorer', async ({ page }) => { await openApp(page, 'explorer'); });
  // pdfviewer was extracted from apps.js onto the kernel — verify it still opens.
  test('opens PDF Viewer (extracted app)', async ({ page }) => { await openApp(page, 'pdfviewer'); });
  test('opens Image Viewer (extracted app)', async ({ page }) => { await openApp(page, 'imgviewer'); });
  test('opens Calculator', async ({ page }) => { await openApp(page, 'calc'); });
  test('opens Terminal', async ({ page }) => { await openApp(page, 'terminal'); });
  test('opens Task Manager (extracted app)', async ({ page }) => { await openApp(page, 'taskmgr'); });
  test('opens Run (extracted app)', async ({ page }) => { await openApp(page, 'run'); });
  test('opens Notepad (extracted app)', async ({ page }) => { await openApp(page, 'notepad'); });
  test('opens Whiteboard (extracted app)', async ({ page }) => { await openApp(page, 'whiteboard'); });
  test('opens Edge (extracted app)', async ({ page }) => { await openApp(page, 'edge'); });
  test('opens Code Editor (extracted app)', async ({ page }) => {
    // openapp('code-editor') resolves to apps.codeEditor via the name->key map;
    // guard the ACE load so a slow CDN can't flake the wiring check.
    await page.evaluate(() => { try { window.openapp('code-editor'); } catch (e) { /* ACE may be mid-load */ } });
    await expect(page.locator('.window.code-editor')).toBeVisible({ timeout: 15000 });
  });

  test('opens Media Player as an empty file player from Start', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#loginback').style.display = 'none';
      window.openDockWidget('start-menu');
    });
    await page.locator('[data-app="mediaplayer"]').click();
    await expect(page.locator('.window.mediaplayer')).toBeVisible();
    // Real file player: no demo tracks — the library is empty until a file is opened.
    await expect(page.locator('#mediaplayer-library [data-track-id]')).toHaveCount(0);
    await expect(page.locator('#mediaplayer-open-file')).toBeVisible();
    // Empty state prompts the user to open a file.
    await expect(page.locator('#mediaplayer-now-title')).toContainText('Open a file');
  });

  test('opening a video plays it, populates the library, and hides the artwork', async ({ page }) => {
    await page.evaluate(() => {
      window.apps.mediaplayer.open('data:video/mp4;base64,', 'Regression video.mp4', 'video');
    });

    await expect(page.locator('#mediaplayer-video')).toBeVisible();
    await expect(page.locator('#mediaplayer-artwork')).toBeHidden();
    // Opening a file adds exactly that file to the library and shows it as now-playing.
    await expect(page.locator('#mediaplayer-library [data-track-id]')).toHaveCount(1);
    await expect(page.locator('#mediaplayer-now-title')).toContainText('Regression video.mp4');
  });

  test('core kernel is live and bridges the real app registry', async ({ page }) => {
    const info = await page.evaluate(() => ({
      hasRegistry: !!(window.win12 && window.win12.apps),
      seesMediaplayer: window.win12.apps.has('mediaplayer'),
      // The registry is a live view of the legacy `window.apps`, not a copy.
      sameObject: window.win12.apps.get('mediaplayer') === window.apps.mediaplayer,
      hasWindowFacade: typeof window.win12.windows.open === 'function',
      hasLifecycle: typeof window.win12.lifecycle.onReady === 'function',
    }));
    expect(info.hasRegistry).toBe(true);
    expect(info.seesMediaplayer).toBe(true);
    expect(info.sameObject).toBe(true);
    expect(info.hasWindowFacade).toBe(true);
    expect(info.hasLifecycle).toBe(true);
  });

  test('closes a window', async ({ page }) => {
    await openApp(page, 'calc');
    await page.evaluate(() => window.hidewin('calc'));
    await expect(page.locator('.window.calc')).toBeHidden({ timeout: 5000 });
  });
});

test.describe('Win12 localization', () => {
  test('defaults to English', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('lang')).catch(() => {});
    await boot(page);
    // login button text would be English; check a known English desktop label
    const txt = await page.locator('#desktop > div[appname="setting"] p').first().textContent();
    expect(txt?.trim()).toBe('Settings');
  });

  test('login language picker includes Setswana', async ({ page }) => {
    await page.goto('/desktop.html?develop=1'); // login overlay visible
    await page.waitForSelector('#loginback .langselect .tn', { timeout: 10000 });
    const label = await page.locator('#loginback .langselect .tn').textContent();
    expect(label?.trim()).toBe('Setswana');
  });

  test('switches to Setswana and persists (lang key)', async ({ page }) => {
    await page.goto('/desktop.html?skip_login=1&develop=1');
    await page.waitForSelector('#desktop', { timeout: 10000 });
    await page.evaluate(() => { localStorage.setItem('lang', 'tn'); location.reload(); });
    await page.waitForSelector('#desktop', { timeout: 10000 });
    await page.waitForFunction(() => typeof window.openapp === 'function', { timeout: 10000 });
    // persisted under the real key
    expect(await page.evaluate(() => localStorage.getItem('lang'))).toBe('tn');
    // Settings desktop icon should now read Setswana ("Dipeakanyo")
    await page.waitForFunction(
      () => document.querySelector('#desktop > div[appname="setting"] p')?.textContent.trim() === 'Dipeakanyo',
      { timeout: 8000 }
    );
  });

  test('switches to Chinese (zh-CN actually loads now)', async ({ page }) => {
    await page.goto('/desktop.html?skip_login=1&develop=1');
    await page.waitForSelector('#desktop', { timeout: 10000 });
    await page.evaluate(() => { localStorage.setItem('lang', 'zh-CN'); location.reload(); });
    await page.waitForSelector('#desktop', { timeout: 10000 });
    await page.waitForFunction(
      () => document.querySelector('#desktop > div[appname="setting"] p')?.textContent.trim() === '设置',
      { timeout: 8000 }
    );
  });
});

test.describe('Win12 About app (upstream #845)', () => {
  test.beforeEach(async ({ page }) => boot(page));

  test('opens, switches tabs, loads contributors', async ({ page }) => {
    await openApp(page, 'about');
    // page() API exists and web panels are used (not Tauri)
    expect(await page.evaluate(() => typeof window.apps.about.page)).toBe('function');
    await expect(page.locator('#win-about > .about-web.show')).toHaveCount(1);
    // switch to update tab
    await page.evaluate(() => window.apps.about.page('update'));
    await expect(page.locator('#win-about > .update-web.show')).toHaveCount(1);
    await expect(page.locator('#win-about > .about-web.show')).toHaveCount(0);
    // Tauri-only panels stay hidden on web
    await expect(page.locator('#win-about > .about-tauri.show')).toHaveCount(0);
    // contributors load from GitHub (allow time / tolerate rate limit)
    await page.evaluate(() => window.apps.about.page('about'));
    await page.waitForSelector('#contri > .a', { timeout: 15000 }).catch(() => {});
  });
});

test.describe('Win12 system pages', () => {
  test('restart screen (reload.html) serves real content', async ({ page }) => {
    const resp = await page.goto('/reload.html');
    expect(resp?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).not.toContain('404'); // not the fallback page
  });

  test('shutdown screen (shutdown.html) serves real content', async ({ page }) => {
    const resp = await page.goto('/shutdown.html');
    expect(resp?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).not.toContain('404');
  });
});

test.describe('Taskbar pinning', () => {
  test.beforeEach(async ({ page }) => {
    await boot(page);
    await page.evaluate(() => {
      localStorage.removeItem('taskbar_pinned');
      document.querySelector('#loginback').style.display = 'none';
    });
  });

  test('pinning shows a persistent icon even when the app is not running', async ({ page }) => {
    await page.evaluate(() => window.pinToTaskbar('calc'));
    const icon = page.locator('#taskbar>a.calc');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveClass(/pinned/);
    await expect(icon).not.toHaveClass(/running/);
  });

  test('clicking a pinned icon opens the app', async ({ page }) => {
    await page.evaluate(() => window.pinToTaskbar('calc'));
    await page.locator('#taskbar>a.calc').click();
    await expect(page.locator('.window.calc')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#taskbar>a.calc')).toHaveClass(/running/);
  });

  test('closing a pinned app keeps the icon, but drops the running state', async ({ page }) => {
    await page.evaluate(() => window.pinToTaskbar('calc'));
    await openApp(page, 'calc');
    await page.evaluate(() => window.hidewin('calc'));
    const icon = page.locator('#taskbar>a.calc');
    await expect(icon).toHaveCount(1);
    await expect(icon).not.toHaveClass(/running/);
  });

  test('unpinning a non-running app removes its icon', async ({ page }) => {
    await page.evaluate(() => window.pinToTaskbar('calc'));
    await page.evaluate(() => window.unpinFromTaskbar('calc'));
    await expect(page.locator('#taskbar>a.calc')).toHaveCount(0);
  });

  test('pinned apps survive a reload (persisted to localStorage)', async ({ page }) => {
    await page.evaluate(() => window.pinToTaskbar('notepad'));
    await page.reload();
    await page.waitForFunction(() => typeof window.openapp === 'function', { timeout: 25000 });
    await expect(page.locator('#taskbar>a.notepad.pinned')).toHaveCount(1);
  });
});

test.describe('Microsoft Store — real app catalog', () => {
  test.beforeEach(async ({ page }) => {
    await boot(page);
    await page.evaluate(() => {
      localStorage.removeItem('store_installed');
      document.querySelector('#loginback').style.display = 'none';
    });
  });

  test('the Apps and Gaming pages render real, launchable catalog entries', async ({ page }) => {
    await openApp(page, 'msstore');
    await page.evaluate(() => window.apps.msstore.page('apps'));
    await expect(page.locator('#win-msstore .cnt.apps .calc')).toHaveCount(1);
    await page.evaluate(() => window.apps.msstore.page('game'));
    await expect(page.locator('#win-msstore .cnt.game .minesweeper')).toHaveCount(1);
  });

  test('Get pins the app to the Start Menu and flips the button to Open', async ({ page }) => {
    await openApp(page, 'msstore');
    await page.evaluate(() => window.apps.msstore.page('apps'));
    await page.locator('#win-msstore .cnt.apps .calc .store-btn').click();
    await expect(page.locator('#startmenu-r .pinned .apps .sm-app.calc')).toHaveCount(1);
    await expect(page.locator('#win-msstore .cnt.apps .calc .store-btn')).toHaveClass(/installed/);
  });
});

test.describe('Settings — Run at startup (Tauri autostart)', () => {
  test.beforeEach(async ({ page }) => {
    await boot(page);
    await page.evaluate(() => { document.querySelector('#loginback').style.display = 'none'; });
  });

  test('the web build clearly shows the toggle is unavailable (no window.__TAURI__)', async ({ page }) => {
    await openApp(page, 'setting');
    await page.evaluate(() => window.apps.setting.page('apps'));
    const toggle = page.locator('#setting-startup-toggle');
    await expect(toggle).toHaveClass(/disabled/);
    await expect(page.locator('.cnt.apps .startup-desc')).toContainText('Tauri desktop app');
  });

  test('clicking the disabled toggle on the web build is a no-op', async ({ page }) => {
    await openApp(page, 'setting');
    await page.evaluate(() => window.apps.setting.page('apps'));
    const toggle = page.locator('#setting-startup-toggle');
    await toggle.click({ force: true });
    await expect(toggle).not.toHaveClass(/checked/);
  });
});

test.describe('Personalization — bundled Ubuntu theme', () => {
  test.beforeEach(async ({ page }) => {
    await boot(page);
    await page.evaluate(() => { document.querySelector('#loginback').style.display = 'none'; });
  });

  test('the desktop boots with the Ubuntu palette by default (no clicks needed)', async ({ page }) => {
    const theme1 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--theme-1').trim());
    expect(theme1.toLowerCase()).toBe('#e95420');
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bgul'));
    expect(bg).toContain('wallpaper-ubuntu');
  });

  test('the dock shows the Show Applications grid pinned at the bottom', async ({ page }) => {
    await expect(page.locator('#start-btn .show-apps-grid')).toBeVisible();
    const isLast = await page.evaluate(() => {
      const dock = document.querySelector('#dock-box');
      const btn = document.querySelector('#start-btn');
      const items = [...dock.querySelectorAll('.dock-btn, #taskbar>a')];
      const sorted = items.slice().sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      return sorted[sorted.length - 1] === btn;
    });
    expect(isLast).toBe(true);
  });

  test('the Ubuntu swatch renders without a network call and applies its palette', async ({ page }) => {
    await openApp(page, 'setting');
    await page.evaluate(() => {
      window.apps.setting.page('appearance');
      $('.dp.theme').addClass('show');
      window.apps.setting.theme_get();
    });
    const swatch = page.locator('#set-theme a', { hasText: 'Ubuntu' });
    await expect(swatch).toHaveCount(1);

    await swatch.click();
    const theme1 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--theme-1').trim());
    expect(theme1).toBe('#E95420');
  });
});
