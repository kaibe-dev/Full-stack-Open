const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'John Doe',
        username: 'johndoe99',
        password: 'password1'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jane Doe',
        username: 'janedoe99',
        password: 'password2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Login to Bloglist')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'johndoe99', 'password1')
      await expect(page.getByText('Logged in as John Doe')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'johndoe99', 'qwerty')
      await expect(page.getByText('ERROR: Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'johndoe99', 'password1')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 
        'The Quiet Art of Slow Mornings',
        'Lila Everhart',
        'https://www.lilaslowbrew.blog'
      )

      await expect(page.getByText('The Quiet Art of Slow Mornings')).toBeVisible()
    })

    describe('When blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 
          'The Quiet Art of Slow Mornings',
          'Lila Everhart',
          'https://www.lilaslowbrew.blog'
        )
        await createBlog(page, 
          'The Future of Climate Fiction',
          'Orion Singh',
          'https://www.greenpages-fiction.org'
        )
        await createBlog(page, 
          'Echoes of Tomorrow: Rethinking Our Digital Futures',
          'Dr. Linnea Calderon',
          'https://www.thoughtweavejournal.com/echoes-of-tomorrow'
        )
      })

      test('blogs can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'like' }).first().click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blogs can be removed', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('The Quiet Art of Slow Mornings')).not.toBeVisible()
      })

      test('blogs are sorted in like order', async ({ page }) => {
        const firstBlogContainer = page.getByText('The Quiet Art of Slow Mornings')
        const secondBlogContainer = page.getByText('The Future of Climate Fiction')
        const thirdBlogContainer = page.getByText('Echoes of Tomorrow: Rethinking Our Digital Futures')

        await firstBlogContainer.getByRole('button', { name: 'view' }).click()
        await secondBlogContainer.getByRole('button', { name: 'view' }).click()
        await thirdBlogContainer.getByRole('button', { name: 'view' }).click()

        await firstBlogContainer.getByRole('button', { name: 'like' }).click()
        
        await secondBlogContainer.getByRole('button', { name: 'like' }).click()
        await secondBlogContainer.getByRole('button', { name: 'like' }).click()

        await thirdBlogContainer.getByRole('button', { name: 'like' }).click()
        await thirdBlogContainer.getByRole('button', { name: 'like' }).click()
        await thirdBlogContainer.getByRole('button', { name: 'like' }).click()

        const allblogsContainer = page.getByTestId('allblogs')
        await expect(allblogsContainer.getByText('likes').first()).toContainText('likes 3')
        await expect(allblogsContainer.getByText('likes').nth(1)).toContainText('likes 2')
        await expect(allblogsContainer.getByText('likes').nth(2)).toContainText('likes 1')
      })
    })
  })

  describe('When blogs added by other users exist', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'johndoe99', 'password1')
      await createBlog(page, 
        'The Quiet Art of Slow Mornings',
        'Lila Everhart',
        'https://www.lilaslowbrew.blog'
      )
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'janedoe99', 'password2')
      await createBlog(page, 
        'The Future of Climate Fiction',
        'Orion Singh',
        'https://www.greenpages-fiction.org'
      )
    })
    test('remove button is only visible to adding user', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'view' }).last().click()

      const firstBlogContainer = page.getByText('The Quiet Art of Slow Mornings')
      const secondBlogContainer = page.getByText('The Future of Climate Fiction')
      
      await expect(firstBlogContainer.getByRole('button', { name: 'remove' })).not.toBeVisible()
      await expect(secondBlogContainer.getByRole('button', { name: 'remove' })).toBeVisible()
    })
  })
})