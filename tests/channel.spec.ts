import { expect, test } from '@playwright/test'

test('channel page had expected to load', async ({ page }) => {
	await page.goto('/channel')
	await expect(page).toHaveURL(/.*channel/)
})
