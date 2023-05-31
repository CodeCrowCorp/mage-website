import { expect, test } from '@playwright/test'

test('browse page had expected to load', async ({ page }) => {
	await page.goto('/browse')
	await expect(page).toHaveURL(/.*browse/)
})
