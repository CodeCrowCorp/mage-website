import { expect, test } from '@playwright/test'

test('creator-space page had expected to load', async ({ page }) => {
    await page.goto('/creator-space')
    await expect(page).toHaveURL(/.*creator-space/)
})