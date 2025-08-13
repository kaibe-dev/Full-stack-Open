import { useState } from 'react'
import { useMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'

const Blog = () => {
  const [comment, setComment] = useState('')
  const match = useMatch('/blogs/:id')
  const blog = useSelector(({ blogs }) =>
    blogs.find((blog) => blog.id === match.params.id)
  )
  const loggedUser = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  const removeSelf = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
    }
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(commentBlog(blog, comment))
    setComment('')
  }

  if (blog === undefined) {
    return <div>loading...</div>
  }

  const showRemoveButton = loggedUser.username === blog.user.username

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <br />
      likes {blog.likes}
      <button onClick={() => handleLike()}>like</button>
      <br />
      {blog.user.name}
      <br />
      {showRemoveButton && <button onClick={() => removeSelf()}>remove</button>}
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
