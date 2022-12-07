import { expect, test } from '@playwright/test'

test('channel page has expected h1', async ({ page }) => {
    await page.goto('/channel/123')
    expect(await page.textContent('h1')).toBe('Welcome to channel page')
})
