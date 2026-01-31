import { test, expect } from '@playwright/test';

const resolveAdminPath = async (request: Parameters<typeof test>[0]['request']) => {
  const candidates = ['/admin', '/pm-website/admin'];
  for (const base of candidates) {
    const response = await request.get(`${base}/index.html`);
    if (response.ok()) {
      return base;
    }
  }
  return null;
};

test.describe('Admin', () => {
  test('admin shell loads', async ({ page, request }) => {
    const base = await resolveAdminPath(request);
    expect(base).toBeTruthy();
    const response = await page.goto(`${base}/index.html`);
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/Content Manager/i);
    await expect(page.locator('script[src*="decap-cms"]')).toHaveCount(1);
    await expect(page.locator('text=/login with github/i')).toBeVisible();
  });

  test('config.yml is accessible', async ({ request }) => {
    const base = await resolveAdminPath(request);
    expect(base).toBeTruthy();
    const response = await request.get(`${base}/config.yml`);
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain('backend:');
    expect(text).toContain('name: github');
    expect(text).toContain('collections:');
  });
});
