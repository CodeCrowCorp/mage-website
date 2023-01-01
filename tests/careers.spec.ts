import { expect, test } from '@playwright/test'

test('careers page had expected to load', async ({ page }) => {
    await page.goto('/careers')
    await expect(page).toHaveURL(/.*careers/)
})