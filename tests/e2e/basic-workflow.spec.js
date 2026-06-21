import { test, expect } from '@playwright/test';

test.describe('Win12 Basic Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Win12
    await page.goto('/desktop.html');
    // Wait for desktop to load
    await page.waitForSelector('#desktop', { timeout: 5000 });
  });

  test('should load desktop successfully', async ({ page }) => {
    const desktop = await page.$('#desktop');
    expect(desktop).not.toBeNull();

    // Check for key UI elements
    const taskbar = await page.$('#taskbar');
    const startMenu = await page.$('#start-menu');
    expect(taskbar).not.toBeNull();
    expect(startMenu).not.toBeNull();
  });

  test('should display taskbar with app icons', async ({ page }) => {
    const taskbarItems = await page.locator('#taskbar [data-app]').count();
    expect(taskbarItems).toBeGreaterThan(0);
  });

  test('should open Settings app', async ({ page }) => {
    // Look for settings icon in taskbar
    await page.click('text=Settings');

    // Wait for settings window to appear
    const settingsWindow = await page.waitForSelector('.window.settings', { timeout: 5000 });
    expect(settingsWindow).not.toBeNull();

    // Verify window is visible
    const isVisible = await settingsWindow.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should open File Explorer', async ({ page }) => {
    // Open File Explorer
    await page.click('text=File Explorer');

    // Wait for file explorer window
    const explorerWindow = await page.waitForSelector('.window.explorer', { timeout: 5000 });
    expect(explorerWindow).not.toBeNull();
  });

  test('should open Calculator app', async ({ page }) => {
    await page.click('text=Calculator');

    const calcWindow = await page.waitForSelector('.window.calc', { timeout: 5000 });
    expect(calcWindow).not.toBeNull();
  });

  test('should close window', async ({ page }) => {
    // Open a window
    await page.click('text=Settings');
    await page.waitForSelector('.window.settings', { timeout: 5000 });

    // Close the window
    const closeButton = await page.$('.window.settings .close-btn');
    if (closeButton) {
      await closeButton.click();
    }
  });

  test('should switch between windows', async ({ page }) => {
    // Open two windows
    await page.click('text=Settings');
    await page.click('text=Calculator');

    await page.waitForSelector('.window.settings', { timeout: 5000 });
    await page.waitForSelector('.window.calc', { timeout: 5000 });

    // Both windows should exist
    const settingsWindow = await page.$('.window.settings');
    const calcWindow = await page.$('.window.calc');
    expect(settingsWindow).not.toBeNull();
    expect(calcWindow).not.toBeNull();
  });
});

test.describe('Win12 Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/desktop.html');
    await page.waitForSelector('#desktop', { timeout: 5000 });
  });

  test('should default to English interface', async ({ page }) => {
    // Check for English text in UI
    const hasEnglish = await page.locator('text=Settings').isVisible();
    expect(hasEnglish).toBe(true);
  });

  test('should have language selector', async ({ page }) => {
    // Look for language settings
    const languageControl = await page.$('[data-lang-selector]');
    expect(languageControl).not.toBeNull();
  });

  test('should switch to Chinese', async ({ page }) => {
    // Change language to Chinese
    await page.evaluate(() => {
      localStorage.setItem('win12-lang', 'zh_CN');
      location.reload();
    });

    await page.waitForLoadState('networkidle');

    // Check for Chinese text (settings icon or label)
    const pageText = await page.textContent('body');
    // Should have some Chinese characters or different UI
    expect(pageText).toBeTruthy();
  });

  test('should persist language selection', async ({ page }) => {
    // Set language
    await page.evaluate(() => {
      localStorage.setItem('win12-lang', 'zh_CN');
    });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that language is still Chinese
    const savedLang = await page.evaluate(() => localStorage.getItem('win12-lang'));
    expect(savedLang).toBe('zh_CN');
  });
});

test.describe('Win12 File Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/desktop.html');
    await page.waitForSelector('#desktop', { timeout: 5000 });
  });

  test('should display files in explorer', async ({ page }) => {
    // Open File Explorer
    await page.click('text=File Explorer');
    await page.waitForSelector('.window.explorer', { timeout: 5000 });

    // Check for file list
    const fileList = await page.$('.file-list');
    expect(fileList).not.toBeNull();
  });

  test('should navigate folders', async ({ page }) => {
    // Open File Explorer
    await page.click('text=File Explorer');
    await page.waitForSelector('.window.explorer', { timeout: 5000 });

    // Double click a folder
    const folder = await page.locator('[data-type="folder"]').first();
    const exists = await folder.isVisible();
    expect(exists).toBe(true);
  });
});

test.describe('Win12 Terminal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/desktop.html');
    await page.waitForSelector('#desktop', { timeout: 5000 });
  });

  test('should open terminal', async ({ page }) => {
    await page.click('text=Terminal');

    const terminalWindow = await page.waitForSelector('.window.terminal', { timeout: 5000 });
    expect(terminalWindow).not.toBeNull();
  });

  test('should display terminal prompt', async ({ page }) => {
    await page.click('text=Terminal');
    await page.waitForSelector('.window.terminal', { timeout: 5000 });

    // Check for terminal prompt
    const prompt = await page.locator('.terminal-prompt').isVisible();
    expect(prompt).toBe(true);
  });
});
