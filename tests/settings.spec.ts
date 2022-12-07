import { expect, test } from '@playwright/test'

test('settings page has expected h1', async ({ page }) => {
    await page.goto('/settings')
    expect(await page.textContent('h1')).toBe('Welcome to settings page')
})
