import { expect, test } from '@playwright/test'

test('not-found page had expected to load', async ({ page }) => {
    await page.goto('/not-found')
    await expect(page).toHaveURL(/.*not-found/)
})