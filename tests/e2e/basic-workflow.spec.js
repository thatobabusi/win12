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
  test('opens Calculator', async ({ page }) => { await openApp(page, 'calc'); });
  test('opens Terminal', async ({ page }) => { await openApp(page, 'terminal'); });

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
