import { expect, afterEach, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch globally
global.fetch = vi.fn();

// Mock jQuery for environment
if (typeof $ === 'undefined') {
  global.$ = {
    ajax: vi.fn(),
    get: vi.fn(),
  };
}

// Extend matchers
expect.extend({
  toBeValidTranslationKey(received) {
    const isString = typeof received === 'string';
    const hasNoSpaces = !received.includes(' ');
    const isValidFormat = /^[a-z0-9._-]+$/i.test(received);

    return {
      pass: isString && hasNoSpaces && isValidFormat,
      message: () =>
        `expected ${received} to be a valid translation key (alphanumeric, dots, underscores, hyphens only)`
    };
  }
});
