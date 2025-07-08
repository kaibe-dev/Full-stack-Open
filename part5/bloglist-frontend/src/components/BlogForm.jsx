import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog, user }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (Event) => {
    Event.preventDefault()
    createBlog({
      user: user,
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
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
            placeholder='title'
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={blogAuthor}
            name="Author"
            placeholder='author'
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={blogUrl}
            name="Url"
            placeholder='url'
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default BlogForm