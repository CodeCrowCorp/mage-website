import { expect, test } from '@playwright/test'

test('admin page has expected h1', async ({ page }) => {
    await page.goto('/admin')
    expect(await page.textContent('h1')).toBe('Welcome to admin page')
})
