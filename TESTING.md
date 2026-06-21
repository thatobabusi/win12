# Win12 Testing Guide

This document describes how to write, run, and maintain tests for Win12 Online.

## Table of Contents

- [Quick Start](#quick-start)
- [Testing Architecture](#testing-architecture)
- [Unit Tests](#unit-tests)
- [E2E Tests](#e2e-tests)
- [Running Tests Locally](#running-tests-locally)
- [CI/CD Pipeline](#cicd-pipeline)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

### Run All Tests

```bash
# Run unit + E2E tests
npm run test:all

# Run only unit tests
npm test

# Run only E2E tests
npm run test:e2e

# Run tests with UI (watch mode)
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## Testing Architecture

### Test Layers

1. **Unit Tests** (60-70% of coverage)
   - Test individual functions and modules
   - Fast execution (~1-2 seconds total)
   - Mocked external dependencies
   - Location: `tests/unit/`

2. **E2E Tests** (20-30% of coverage)
   - Test complete user workflows
   - Run in real browsers (Chromium, Firefox, WebKit)
   - Slower execution (~3-5 seconds per test)
   - Location: `tests/e2e/`

3. **Linting** (Code quality)
   - ESLint for JavaScript quality
   - Enforces consistent code style
   - Runs before tests in CI

### Test Structure

```
tests/
├── setup.js                    # Global test setup
├── unit/
│   ├── i18n.test.js           # Translation system tests
│   ├── window-manager.test.js  # Window operations tests
│   └── calculator.test.js      # Calculator logic tests
└── e2e/
    ├── basic-workflow.spec.js  # Desktop + window operations
    └── apps.spec.js            # Application-specific workflows
```

---

## Unit Tests

Unit tests verify individual functions and modules in isolation.

### Example: Translation System

**File:** `tests/unit/i18n.test.js`

```javascript
import { describe, it, expect } from 'vitest';

describe('i18n Translation System', () => {
  it('should return English translation when key exists', () => {
    const lang = (txt, id) => mockI18nData.en[id] || txt;
    expect(lang('Default', 'setting.name')).toBe('Settings');
  });

  it('should return fallback text when key not found', () => {
    const lang = (txt, id) => mockI18nData.en[id] || txt;
    expect(lang('Unknown', 'nonexistent')).toBe('Unknown');
  });
});
```

### Writing Unit Tests

1. **Test naming**: Use `describe()` for test groups, `it()` for individual tests
   ```javascript
   describe('Feature', () => {
     it('should do something specific', () => { ... });
   });
   ```

2. **Test structure**: Arrange → Act → Assert
   ```javascript
   it('should calculate sum correctly', () => {
     // Arrange
     const a = 5, b = 3;
     
     // Act
     const result = add(a, b);
     
     // Assert
     expect(result).toBe(8);
   });
   ```

3. **Mocking**: Use `vi.fn()` for mocks
   ```javascript
   const mockFetch = vi.fn();
   mockFetch.mockResolvedValue({ data: 'test' });
   ```

### Common Assertions

```javascript
expect(value).toBe(expected);           // Exact equality
expect(value).toEqual(expected);        // Deep equality
expect(array).toContain(item);          // Array contains
expect(value).toBeGreaterThan(5);       // Numeric comparison
expect(fn).toHaveBeenCalled();          // Function was called
expect(fn).toHaveBeenCalledWith(args);  // Function called with args
expect(value).toBeValidTranslationKey(); // Custom matcher
```

---

## E2E Tests

E2E tests verify complete user workflows in a real browser environment.

### Example: Opening Applications

**File:** `tests/e2e/basic-workflow.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test('should open Settings app', async ({ page }) => {
  // Navigate to desktop
  await page.goto('/desktop.html');
  await page.waitForSelector('#desktop');

  // Click Settings
  await page.click('text=Settings');

  // Wait for window to appear
  const settingsWindow = await page.waitForSelector('.window.settings');
  expect(settingsWindow).not.toBeNull();
});
```

### Writing E2E Tests

1. **Initialization**: Use `test.beforeEach()` for setup
   ```javascript
   test.beforeEach(async ({ page }) => {
     await page.goto('/desktop.html');
     await page.waitForSelector('#desktop');
   });
   ```

2. **Navigation and interaction**
   ```javascript
   await page.goto('/desktop.html');           // Navigate
   await page.click('text=Button');            // Click by text
   await page.click('#element-id');            // Click by selector
   await page.fill('input', 'text');           // Fill input
   await page.keyboard.type('hello');          // Type text
   ```

3. **Assertions**
   ```javascript
   const element = await page.$('.selector');
   expect(element).not.toBeNull();

   const isVisible = await element.isVisible();
   expect(isVisible).toBe(true);

   const text = await element.textContent();
   expect(text).toContain('expected text');
   ```

4. **Waits and timeouts**
   ```javascript
   await page.waitForSelector('.element');     // Wait for element
   await page.waitForLoadState('networkidle'); // Wait for network
   await page.waitForTimeout(1000);            // Wait 1 second
   ```

### Test Scenarios to Cover

- **App Launching**: Open each app and verify window appears
- **Window Operations**: Drag, resize, minimize, maximize windows
- **File Operations**: Navigate folders, create/delete files
- **Language Switching**: Change language and verify UI updates
- **Settings**: Change theme, personalization options
- **Terminal**: Execute commands and verify output
- **Keyboard Shortcuts**: Test keyboard navigation

---

## Running Tests Locally

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test File
```bash
npm test -- tests/unit/i18n.test.js
npm run test:e2e -- tests/e2e/basic-workflow.spec.js
```

### Watch Mode (Auto-rerun on file changes)
```bash
npm test -- --watch
npm run test:e2e -- --headed    # See browser
```

### Debug Mode
```bash
# UI mode - interactive test runner
npm run test:ui

# Headed mode - see browser actions
npm run test:e2e -- --headed

# Debug mode - step through test
npm run test:e2e -- --debug
```

### Coverage Report
```bash
npm run test:coverage

# View HTML report
open coverage/index.html
```

---

## CI/CD Pipeline

Tests run automatically on:
- **Push to main/develop**: All tests run
- **Pull Request**: All tests run before merge
- **Results**: Posted as PR comment with status

### Workflow Status

View test status:
1. Go to repository → Actions tab
2. Select workflow run
3. View detailed logs for failures

### Failure Handling

If tests fail in CI:
1. Check workflow logs for error details
2. Reproduce locally: `npm run test:all`
3. Fix code
4. Push fix - tests will re-run automatically

---

## Best Practices

### Do's ✅

- **Isolate tests**: Each test should be independent
- **Use descriptive names**: Test names should explain what they verify
- **Mock external dependencies**: Don't make real API calls
- **Test edge cases**: Test error conditions, boundaries, invalid input
- **Keep tests fast**: Optimize for execution speed
- **Use fixtures**: Reuse common test data with `beforeEach()`
- **Organize by feature**: Group related tests together
- **Assert one thing**: Each test should verify one behavior

### Don'ts ❌

- **Don't test implementation details**: Test behavior, not code structure
- **Don't share state between tests**: Each test should start clean
- **Don't make real API calls**: Mock or use test data
- **Don't hardcode delays**: Use proper waits and timeouts
- **Don't test third-party libraries**: Assume they work correctly
- **Don't write flaky tests**: Tests should be deterministic
- **Don't skip tests**: Mark with `.skip` if genuinely needed, document why

### Code Coverage Goals

- **Statements**: 50%+
- **Branches**: 50%+
- **Functions**: 50%+
- **Lines**: 50%+

Aim to gradually increase coverage as features stabilize.

---

## Troubleshooting

### Common Issues

#### "SyntaxError: Identifier already declared"
**Cause**: Variable redeclaration in test setup
**Fix**: Check `tests/setup.js` - ensure no duplicate declarations

#### "timeout waiting for selector"
**Cause**: Element doesn't exist or takes too long to appear
**Fix**: Increase timeout or check page has loaded: `await page.waitForLoadState('networkidle')`

#### "Test passes locally but fails in CI"
**Cause**: Environment differences (speed, browser, timing)
**Fix**: Add explicit waits, don't rely on timeouts, use `waitForSelector()`

#### "ESLint errors in PR"
**Cause**: Code style violations
**Fix**: Run `npm run lint:fix` to auto-fix, then commit

#### "E2E tests timeout"
**Cause**: Web server not running or wrong URL
**Fix**: Ensure Python HTTP server running: `python -m http.server 3000`

### Getting Help

1. Check test logs: `npm test -- --reporter=verbose`
2. Use debug mode: `npm run test:e2e -- --debug`
3. Check Playwright docs: https://playwright.dev
4. Check Vitest docs: https://vitest.dev

---

## Contributing Tests

When adding new features:

1. **Write test first** (TDD approach)
   ```bash
   npm test -- --watch tests/unit/new-feature.test.js
   ```

2. **Implement feature**
   Edit source code until test passes

3. **Add E2E test** for user-facing features
   ```bash
   npm run test:e2e -- --headed
   ```

4. **Commit with tests**
   ```bash
   git add tests/ src/
   git commit -m "feat: add new feature with tests"
   ```

5. **Push and verify CI** passes

---

## Test Examples by Feature

### Translation (i18n)
- **Location**: `tests/unit/i18n.test.js`
- **Tests**: Key validation, language lookup, completeness, normalization

### Window Management
- **Location**: `tests/unit/window-manager.test.js`
- **Tests**: Positioning, resizing, state, z-index, snapping

### Applications
- **Location**: `tests/e2e/basic-workflow.spec.js`
- **Tests**: App opening, workflow completion, window operations

### File Explorer
- **Location**: `tests/e2e/basic-workflow.spec.js` (to be expanded)
- **Tests**: Navigation, file operations, folder display

---

## Next Steps

1. Run tests locally to ensure setup works
2. Review test examples and patterns
3. Write tests for new features
4. Monitor CI pipeline for test results
5. Gradually increase code coverage

Good luck! 🚀
