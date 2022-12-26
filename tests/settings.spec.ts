import { expect, test } from '@playwright/test'

test('settings page had expected to load', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/.*settings/)
})