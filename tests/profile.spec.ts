import { expect, test } from '@playwright/test'

test('profile page had expected to load', async ({ page }) => {
	await page.goto('/profile')
	await expect(page).toHaveURL(/.*profile/)
})
