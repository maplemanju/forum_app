import { test, expect } from '@playwright/test'
import { config } from '@/utils/config'

test(`homepage has [${config.siteName}] on title and a Login button`, async ({
  page,
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle(new RegExp(config.siteName, 'i'))
  const loginLink = page.getByRole('button', { name: /login/i })
  await expect(loginLink).toBeVisible()
})
