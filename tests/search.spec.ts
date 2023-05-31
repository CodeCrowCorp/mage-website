import { expect, test } from '@playwright/test'

test('search page had expected to load', async ({ page }) => {
	await page.goto('/search/test')
	await expect(page).toHaveURL(/.*search/)
})
