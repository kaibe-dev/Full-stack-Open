import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const defaultBlog = {
  title: 'test title',
  author: 'test author',
  url: 'test url',
  user: {
    username: 'test username',
    name:'test name',
    id: '1122334455'
  },
  likes:'1'
}

const defaultUser = {
  username: 'test username',
  id: '1122334455'
}

const updateBlog = vi.fn()

test('only title and author are shown by default', () => {
  render (<Blog blog={defaultBlog} user={defaultUser} />)

  const titleElement = screen.getByText('test title', { exact: false })
  expect(titleElement).toBeDefined()
  const authorElement = screen.getByText('test author', { exact: false })
  expect(authorElement).toBeDefined()

  const urlElement = screen.queryByText('test url')
  expect(urlElement).toBeNull()
  const nameElement = screen.queryByText('test name')
  expect(nameElement).toBeNull()
  const likesElement = screen.queryByText('1')
  expect(likesElement).toBeNull()
})

test('pressing view button displays url, likes and username', async () => {
  render (<Blog blog={defaultBlog} user={defaultUser} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const urlElement = screen.getByText('test url', { exact: false })
  expect(urlElement).toBeDefined()
  const nameElement = screen.getByText('test name', { exact: false })
  expect(nameElement).toBeDefined()
  const likesElement = screen.getByText('1', { exact: false })
  expect(likesElement).toBeDefined()
})

test('pressing like button twice likes the blog twice', async () => {
  render (<Blog blog={defaultBlog} user={defaultUser} updateBlog={updateBlog} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})