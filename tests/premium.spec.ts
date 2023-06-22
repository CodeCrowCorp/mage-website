import { expect, test } from '@playwright/test'

test('premium page had expected to load', async ({ page }) => {
	await page.goto('/premium')
	await expect(page).toHaveURL(/.*premium/)
})
