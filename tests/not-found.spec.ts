import { expect, test } from '@playwright/test'

test('not found page has expected h1', async ({ page }) => {
    await page.goto('/not-found')
    expect(await page.textContent('h1')).toBe('Welcome to not-found page')
})
