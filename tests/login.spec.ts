import { expect, test } from '@playwright/test'

test('login page has expected h1', async ({ page }) => {
    await page.goto('/login')
    expect(await page.textContent('h1')).toBe('Welcome to login page')
})
