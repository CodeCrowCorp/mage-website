import { expect, test } from '@playwright/test'

test('videos page had expected to load', async ({ page }) => {
    await page.goto('/videos')
    await expect(page).toHaveURL(/.*videos/)
})