import { expect, test } from '@playwright/test'

test('premium page has expected h1', async ({ page }) => {
    await page.goto('/premium')
    expect(await page.textContent('h1')).toBe('Welcome to premium page')
})
