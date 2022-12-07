import { expect, test } from '@playwright/test'

test('maintenance page has expected h1', async ({ page }) => {
    await page.goto('/maintenance')
    expect(await page.textContent('h1')).toBe('Welcome to maintenance page')
})
