import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/Login/)
    await expect(page.locator('h1')).toContainText('Login')
    
    // Check for login form elements
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should display register page', async ({ page }) => {
    await page.goto('/register')
    
    await expect(page).toHaveTitle(/Register/)
    await expect(page.locator('h1')).toContainText('Register')
    
    // Check for register form elements
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('select[name="role"]')).toBeVisible()
  })

  test('should validate login form', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should validate register form', async ({ page }) => {
    await page.goto('/register')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login')
    
    // Click link to register
    await page.click('text=Create an account')
    await expect(page).toHaveURL(/register/)
    
    // Click link back to login
    await page.click('text=Already have an account')
    await expect(page).toHaveURL(/login/)
  })
})
