import { expect, test } from '@playwright/test'

test('home page has expected h1', async ({ page }) => {
    await page.goto('/home')
    expect(await page.textContent('h1')).toBe('Welcome to home page')
})
