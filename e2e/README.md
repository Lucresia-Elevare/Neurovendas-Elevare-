# E2E Testing Guide - Elevare/LucresIA

End-to-end testing infrastructure for the QuickCreate flow using Playwright.

## Overview

This directory contains E2E tests that validate the complete user journey through the QuickCreate flow, ensuring:
- ✅ Creation time < 5 minutes
- ✅ Completion rate > 80%
- ✅ All analytics events tracked
- ✅ Real-time AI features working
- ✅ Mobile responsiveness

## Setup

### 1. Install Dependencies

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

### 2. Add Test Fixtures

Place test images in `e2e/fixtures/`:
- `before.jpg` - Before image for transformation presets
- `after.jpg` - After image for transformation presets  
- `product.jpg` - Product/service image
- `testimonial.jpg` - Testimonial/client image
- `promo.jpg` - Promotional offer image
- `clinic.jpg` - Clinic/workspace image

**Image Requirements**:
- Format: JPG or PNG
- Size: 500KB - 2MB
- Resolution: 800x800 to 1920x1920
- Aspect ratio: Square or 4:5

### 3. Configure Environment

Create `.env` with test credentials:

```bash
# Test user for E2E tests
TEST_USER_EMAIL=test@elevare.com
TEST_USER_PASSWORD=test123

# Base URL
E2E_BASE_URL=http://localhost:5000
```

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run with UI Mode (Recommended for Development)

```bash
npm run test:e2e:ui
```

This opens an interactive UI where you can:
- See test execution in real-time
- Inspect DOM at any step
- Debug failures visually
- Time travel through test steps

### Run Specific Test

```bash
npx playwright test quickcreate.spec.ts
```

### Run on Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=mobile-chrome
```

### Debug Mode

```bash
npx playwright test --debug
```

## Test Structure

### Quick Create Flow Tests (`tests/quickcreate.spec.ts`)

**Critical User Journey Tests**:
1. Complete flow under 5 minutes (Happy Path)
2. Real-time engagement scoring
3. AI suggestion one-click application
4. Analytics event tracking
5. Form validation
6. Mobile responsiveness

**Performance Tests**:
1. Page load < 3 seconds
2. AI generation < 10 seconds

## Viewing Test Results

After running tests, view reports:

```bash
npx playwright show-report
```

This opens an HTML report with:
- Test results (pass/fail)
- Execution times
- Screenshots of failures
- Videos of failed tests
- Trace files for debugging

## CI/CD Integration

Tests run automatically in GitHub Actions on every pull request.

To run tests in CI mode locally:

```bash
CI=true npm run test:e2e
```

This enables:
- Retries on flaky tests (2 retries)
- Single worker (no parallel execution)
- Stricter failure handling

## Test Configuration

Configuration file: `e2e/playwright.config.ts`

**Key Settings**:
- **Timeout**: 30s per test
- **Retries**: 2 in CI, 0 locally
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5 (Android), iPhone 12 (iOS)
- **Screenshots**: Only on failure
- **Videos**: Retained on failure
- **Traces**: On first retry

**Environment**:
- Base URL: `http://localhost:5000` (configurable via `E2E_BASE_URL`)
- Auto-starts dev server if not running

## Writing New Tests

### Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup: Login, navigate, etc.
    await page.goto('/quick-create');
  });
  
  test('should do something', async ({ page }) => {
    // Arrange
    await page.click('[data-preset-id="test-preset"]');
    
    // Act
    await page.click('button:has-text("Continuar")');
    
    // Assert
    await expect(page).toHaveURL('/quick-create?step=upload');
  });
});
```

### Best Practices

1. **Use data attributes for selectors**:
   ```typescript
   // Good
   await page.click('[data-preset-id="transformacao-incrivel"]');
   
   // Avoid (brittle)
   await page.click('.preset-card:nth-child(1) button');
   ```

2. **Wait for network idle**:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Use test steps for clarity**:
   ```typescript
   await test.step('Upload images', async () => {
     // ... upload logic
   });
   ```

4. **Handle async operations**:
   ```typescript
   await expect(page.locator('[data-ai-generated]'))
     .toBeVisible({ timeout: 10000 }); // 10s for AI
   ```

5. **Clean up after tests**:
   ```typescript
   test.afterEach(async ({ page }) => {
     // Delete test data, logout, etc.
   });
   ```

## Troubleshooting

### Tests Fail Locally But Pass in CI

- Ensure same Node version
- Check for timing issues (add explicit waits)
- Verify test data exists

### "Element not found" Errors

- Increase timeout: `await page.locator('...').waitFor({ timeout: 10000 })`
- Check selector: Use `page.pause()` to inspect DOM
- Ensure element is visible: `await expect(locator).toBeVisible()`

### Flaky Tests

- Add `test.retry()` for known flaky tests
- Use `page.waitForLoadState('networkidle')`
- Avoid fixed timeouts (`page.waitForTimeout()`)

### Slow Tests

- Run fewer browsers locally: `--project=chromium`
- Disable videos: Set `video: 'off'` in config
- Skip non-critical tests: `test.skip()`

## Performance Benchmarks

Target metrics validated by tests:

| Metric | Target | Test |
|--------|--------|------|
| Page Load | <3s | `Page loads under 3 seconds` |
| AI Generation | <10s | `AI generation responds under 10 seconds` |
| Complete Flow | <5min | `Complete QuickCreate flow under 5 minutes` |
| Engagement Update | <1.5s | `Real-time engagement scoring updates` |

## Maintenance

### Update Browsers

```bash
npx playwright install --with-deps
```

### Update Test Data

Replace fixture images in `e2e/fixtures/` as needed.

### Update Selectors

If UI changes, update data attributes:
1. Add `data-testid` to components
2. Update selectors in tests
3. Run tests to verify

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

**Last Updated**: January 5, 2026  
**Playwright Version**: 1.40+
