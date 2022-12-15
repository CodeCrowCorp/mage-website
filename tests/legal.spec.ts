import { expect, test } from '@playwright/test'

test('legal page has expected h1', async ({ page }) => {
    await page.goto('/legal')
    expect(await page.textContent('h1')).toBe('Welcome to legal page')
})
