import { expect, test } from '@playwright/test'

test('contact page has expected h1', async ({ page }) => {
    await page.goto('/contact')
    expect(await page.textContent('h1')).toBe('Welcome to contact page')
})
