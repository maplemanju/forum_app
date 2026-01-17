import { test, expect } from '@playwright/test'

test('Sidebar: shows category list on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')

  const categoryList = page.locator('[data-testid="sidebar-categories"]')
  await expect(categoryList).toBeVisible()

  const categories = categoryList.locator(
    '[data-testid="sidebar-category-item"]'
  )
  const count = await categories.count()
  expect(count).toBe(1) // Seed data has 1 top category
})

test('Drawer: Mobile hamburger opens category menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const menuButton = page.locator('[data-testid="drawer-toggle-button"]')
  await expect(menuButton).toBeVisible()

  await menuButton.click()

  const mobileMenu = page.locator('[data-testid="mobile-menu"]')
  await expect(mobileMenu).toBeVisible()

  const categories = mobileMenu.locator('[data-testid="drawer-categories"]')
  await expect(categories).toBeVisible()

  const categoryItems = categories.locator(
    '[data-testid="sidebar-category-item"]'
  )
  const count = await categoryItems.count()
  expect(count).toBe(1) // Seed data has 1 top category
})
