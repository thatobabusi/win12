import { defineConfig, devices } from '@playwright/test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// 8123 avoids the common dev-server port 3000 (often already in use on this machine).
const PORT = process.env.WIN12_E2E_PORT || 8123;

export default defineConfig({
  // testDir is relative to THIS file (config/), so point back up to the project root.
  testDir: resolve(here, '..', 'tests', 'e2e'),
  // The desktop pulls large/CDN scripts on a cold load; 30s was too tight and flaked.
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Serves public/ (the web root). e2e tests append ?skip_login=1&develop=1.
  webServer: process.env.CI ? undefined : {
    command: `python -m http.server ${PORT} --directory ./public`,
    cwd: resolve(here, '..'),
    url: `http://localhost:${PORT}/desktop.html`,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
