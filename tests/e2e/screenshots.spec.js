import { test } from '@playwright/test';

// Manual screenshot generator for the README "Feature Preview" section.
// The upstream image host (win12-online.github.io) is gone, so we regenerate
// these locally. Run explicitly:
//   CAPTURE_SCREENSHOTS=1 npx playwright test --config config/playwright.config.js --project chromium screenshots
// Output: ./src/assets/images/*.png, referenced by README.md.

const CAPTURE = !!process.env.CAPTURE_SCREENSHOTS;
const URL = '/desktop.html?skip_login=1&develop=1';

test.describe('README screenshots', () => {
  test.skip(!CAPTURE, 'Set CAPTURE_SCREENSHOTS=1 to (re)generate README screenshots');
  test.use({ viewport: { width: 1280, height: 800 } });

  async function boot(page) {
    await page.goto(URL);
    await page.waitForSelector('#desktop', { timeout: 20000 });
    await page.waitForFunction(() => typeof window.openapp === 'function', { timeout: 25000 });
    await page.evaluate(() => { const l = document.querySelector('#loginback'); if (l) l.style.display = 'none'; });
    await page.waitForTimeout(1500); // let wallpaper / widgets settle
  }

  test('start-menu', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => window.openDockWidget('start-menu'));
    await page.waitForTimeout(900);
    await page.screenshot({ path: 'src/assets/images/start-menu.png' });
  });

  test('colorful-apps', async ({ page }) => {
    await boot(page);
    // File Explorer shows off the colourful app surface (tag colours, sidebar).
    // Wrapped in try/catch because some app globals load on a deferred script.
    await page.evaluate(() => { try { window.openapp('setting'); } catch (e) { /* noop */ } });
    await page.waitForTimeout(600);
    await page.evaluate(() => { try { window.openapp('explorer'); } catch (e) { /* noop */ } });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'src/assets/images/colorful-apps.png' });
  });

  test('dark-mode', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => { if (typeof window.toggletheme === 'function') window.toggletheme(); });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'src/assets/images/dark-mode.png' });
  });

  // The upstream AI Copilot needs an external API service that no longer exists
  // (it 404s), so we feature the working Media Player instead.
  test('media-player', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => { try { window.openapp('mediaplayer'); } catch (e) { /* noop */ } });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'src/assets/images/media-player.png' });
  });
});
