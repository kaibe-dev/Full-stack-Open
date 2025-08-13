import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { useSelector } from 'react-redux'

const BlogForm = ({ handleSuccess }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  const addBlog = async (Event) => {
    Event.preventDefault()
    const success = await dispatch(
      createBlog({
        user: user,
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      })
    )

    if (success) {
      handleSuccess()
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
    }
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={blogTitle}
            name="Title"
            placeholder="title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={blogAuthor}
            name="Author"
            placeholder="author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={blogUrl}
            name="Url"
            placeholder="url"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
