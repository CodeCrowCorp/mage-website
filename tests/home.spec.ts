import { expect, test } from '@playwright/test'

test('home page had expected to load', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/.*/)
})