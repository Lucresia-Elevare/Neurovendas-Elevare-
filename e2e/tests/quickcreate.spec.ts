import { test, expect } from '@playwright/test';

/**
 * E2E Tests for QuickCreate Flow
 * 
 * Critical Success Metrics:
 * - Creation time < 5 minutes
 * - Completion rate > 80%
 * - All analytics events tracked
 */

test.describe('QuickCreate Flow - Critical User Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup: Login and navigate to QuickCreate
    await page.goto('/login');
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || 'test@elevare.com');
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || 'test123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Navigate to QuickCreate
    await page.goto('/quick-create');
    await expect(page).toHaveURL('/quick-create');
  });
  
  test('Complete QuickCreate flow under 5 minutes - Happy Path', async ({ page }) => {
    const startTime = Date.now();
    
    // Step 1: Preset Selection
    await test.step('Select NeuroVendas Preset', async () => {
      await expect(page.locator('h2')).toContainText('Escolha seu Preset');
      await page.click('[data-preset-id="transformacao-incrivel"]');
      await page.click('button:has-text("Continuar")');
      
      // Validate analytics event
      await expect(page.locator('[data-current-step="upload"]')).toBeVisible();
    });
    
    // Step 2: Image Upload
    await test.step('Upload Images (Before/After)', async () => {
      await expect(page.locator('h2')).toContainText('Adicione Imagens');
      
      // Upload 2 images
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles([
        'e2e/fixtures/before.jpg',
        'e2e/fixtures/after.jpg',
      ]);
      
      // Wait for upload confirmation
      await expect(page.locator('[data-image-count="2"]')).toBeVisible();
      await page.click('button:has-text("Continuar")');
      
      await expect(page.locator('[data-current-step="copy"]')).toBeVisible();
    });
    
    // Step 3: Copy Creation with AI
    await test.step('Generate Caption with LucresIA', async () => {
      await expect(page.locator('h2')).toContainText('Crie a Legenda');
      
      // Click "Generate with AI"
      await page.click('button:has-text("Gerar com LucresIA")');
      
      // Wait for AI generation (max 10s)
      await expect(page.locator('textarea[name="caption"]')).not.toBeEmpty({ timeout: 10000 });
      
      // Verify engagement score appears
      await expect(page.locator('[data-engagement-score]')).toBeVisible();
      
      // Check score is reasonable (>60%)
      const scoreText = await page.locator('[data-engagement-score]').textContent();
      const score = parseInt(scoreText || '0');
      expect(score).toBeGreaterThan(60);
      
      await page.click('button:has-text("Continuar")');
      await expect(page.locator('[data-current-step="publish"]')).toBeVisible();
    });
    
    // Step 4: Review & Publish
    await test.step('Review and Publish Post', async () => {
      await expect(page.locator('h2')).toContainText('Revisar e Publicar');
      
      // Verify preview elements
      await expect(page.locator('[data-post-preview]')).toBeVisible();
      await expect(page.locator('[data-score-breakdown]')).toBeVisible();
      
      // Publish
      await page.click('button:has-text("Publicar Agora")');
      
      // Wait for success confirmation
      await expect(page.locator('[data-publish-success]')).toBeVisible({ timeout: 10000 });
    });
    
    // Validate total time < 5 minutes
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(5 * 60 * 1000); // 5 minutes
    
    console.log(`✅ QuickCreate completed in ${(totalTime / 1000).toFixed(1)}s`);
  });
  
  test('Real-time engagement scoring updates as user types', async ({ page }) => {
    // Navigate to copy step
    await page.click('[data-preset-id="oferta-relampago"]');
    await page.click('button:has-text("Continuar")');
    
    // Skip image upload for this test
    await page.setInputFiles('input[type="file"]', 'e2e/fixtures/product.jpg');
    await page.click('button:has-text("Continuar")');
    
    // Type caption and watch score update
    const textarea = page.locator('textarea[name="caption"]');
    const scoreElement = page.locator('[data-engagement-score]');
    
    await textarea.fill('✨ Oferta incrível!');
    await expect(scoreElement).toBeVisible();
    
    const score1 = await scoreElement.textContent();
    
    // Add more content
    await textarea.fill('✨ Oferta incrível! Agende agora e ganhe 20% OFF. Últimas vagas! 📞');
    
    // Wait for debounced update (1s)
    await page.waitForTimeout(1500);
    
    const score2 = await scoreElement.textContent();
    
    // Score should improve with better content
    expect(parseInt(score2 || '0')).toBeGreaterThan(parseInt(score1 || '0'));
  });
  
  test('AI suggestions can be applied with one click', async ({ page }) => {
    // Navigate to copy step
    await page.click('[data-preset-id="depoimento-real"]');
    await page.click('button:has-text("Continuar")');
    await page.setInputFiles('input[type="file"]', 'e2e/fixtures/testimonial.jpg');
    await page.click('button:has-text("Continuar")');
    
    // Generate initial caption
    await page.click('button:has-text("Gerar com LucresIA")');
    await page.waitForSelector('textarea[name="caption"]:not([value=""])', { timeout: 10000 });
    
    const captionBefore = await page.locator('textarea[name="caption"]').inputValue();
    
    // Wait for suggestions to appear
    await expect(page.locator('[data-suggestion]')).toBeVisible({ timeout: 3000 });
    
    // Click first suggestion
    await page.click('[data-suggestion]:first-child button:has-text("Aplicar")');
    
    // Wait for caption update
    await page.waitForTimeout(500);
    
    const captionAfter = await page.locator('textarea[name="caption"]').inputValue();
    
    // Caption should be different
    expect(captionAfter).not.toBe(captionBefore);
  });
  
  test('Analytics events are tracked throughout journey', async ({ page }) => {
    // Listen for analytics events
    const events: string[] = [];
    
    page.on('console', msg => {
      if (msg.text().includes('track(')) {
        events.push(msg.text());
      }
    });
    
    // Complete flow
    await page.click('[data-preset-id="transformacao-incrivel"]');
    await page.click('button:has-text("Continuar")');
    
    await page.setInputFiles('input[type="file"]', ['e2e/fixtures/before.jpg']);
    await page.click('button:has-text("Continuar")');
    
    await page.fill('textarea[name="caption"]', 'Test caption with CTA 📞');
    await page.click('button:has-text("Continuar")');
    
    // Validate expected events were tracked
    expect(events).toEqual(expect.arrayContaining([
      expect.stringContaining('quick_create_started'),
      expect.stringContaining('preset_selected'),
      expect.stringContaining('image_uploaded'),
    ]));
  });
  
  test('Flow validates required fields before advancing', async ({ page }) => {
    // Try to advance without selecting preset
    const continueButton = page.locator('button:has-text("Continuar")');
    await expect(continueButton).toBeDisabled();
    
    // Select preset
    await page.click('[data-preset-id="combo-irresistivel"]');
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    
    // Try to advance without uploading image
    await expect(page.locator('button:has-text("Continuar")')).toBeDisabled();
    
    // Upload image
    await page.setInputFiles('input[type="file"]', 'e2e/fixtures/product.jpg');
    await expect(page.locator('button:has-text("Continuar")')).toBeEnabled();
  });
  
  test('Mobile responsive - QuickCreate works on mobile devices', async ({ page }) => {
    // This test runs on mobile-chrome and mobile-safari projects
    if (page.viewportSize()?.width && page.viewportSize()!.width < 768) {
      // Verify mobile-optimized UI
      await expect(page.locator('[data-mobile-optimized]')).toBeVisible();
      
      // Complete flow on mobile
      await page.click('[data-preset-id="flash-sale"]');
      await page.click('button:has-text("Continuar")');
      
      // Mobile image upload
      await page.setInputFiles('input[type="file"]', 'e2e/fixtures/promo.jpg');
      await expect(page.locator('[data-image-count="1"]')).toBeVisible();
      
      // Verify touch-friendly UI elements
      const buttons = page.locator('button');
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i);
        const size = await button.boundingBox();
        // Minimum touch target: 44x44px (Apple HIG)
        if (size) {
          expect(size.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});

test.describe('QuickCreate Performance Tests', () => {
  
  test('Page loads under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/quick-create');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    console.log(`✅ Page loaded in ${loadTime}ms`);
  });
  
  test('AI generation responds under 10 seconds', async ({ page }) => {
    // Setup
    await page.goto('/quick-create');
    await page.click('[data-preset-id="autoridade-tecnica"]');
    await page.click('button:has-text("Continuar")');
    await page.setInputFiles('input[type="file"]', 'e2e/fixtures/clinic.jpg');
    await page.click('button:has-text("Continuar")');
    
    // Measure AI generation time
    const startTime = Date.now();
    await page.click('button:has-text("Gerar com LucresIA")');
    await expect(page.locator('textarea[name="caption"]')).not.toBeEmpty({ timeout: 10000 });
    const generationTime = Date.now() - startTime;
    
    expect(generationTime).toBeLessThan(10000);
    console.log(`✅ AI generated caption in ${generationTime}ms`);
  });
});
