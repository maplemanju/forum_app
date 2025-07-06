import { test, expect } from '@playwright/test'

test('Home page loads recent posts', async ({ page }) => {
  await page.goto('/')

  // Expect recent posts to be visible (assumes each post has a .post-card class or similar)
  const posts = page.locator('[data-testid="post-card"]')
  await expect(posts.first()).toBeVisible()

  // check post title
  await expect(posts.first()).toContainText('Welcome to our Forum') // from seed data
})
