import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('blog creation works', async () => {
  const mockUser = {
    username: 'JohnDoe69',
    name: 'John Doe',
    id: '1122334455'
  }

  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} user={mockUser} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a title...')
  await user.type(authorInput, 'testing an author...')
  await user.type(urlInput, 'testing an url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing an author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing an url...')
})