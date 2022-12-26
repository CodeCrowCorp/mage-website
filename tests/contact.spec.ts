import { expect, test } from '@playwright/test'

test('contact page had expected to load', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveURL(/.*contact/)
})