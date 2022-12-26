import { expect, test } from '@playwright/test'

test('legal page had expected to load', async ({ page }) => {
    await page.goto('/legal')
    await expect(page).toHaveURL(/.*legal/)
})