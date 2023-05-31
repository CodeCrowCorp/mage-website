import { expect, test } from '@playwright/test'

test('maintenance page had expected to load', async ({ page }) => {
	await page.goto('/maintenance')
	await expect(page).toHaveURL(/.*maintenance/)
})
