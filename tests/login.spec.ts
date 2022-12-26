import { expect, test } from '@playwright/test'

test('login page had expected to load', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/.*login/)
})