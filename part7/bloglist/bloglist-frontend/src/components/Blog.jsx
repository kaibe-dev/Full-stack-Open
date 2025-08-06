import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [isActive, setIsActive] = useState(false)
  const dispatch = useDispatch()

  const showRemoveButton = user.username === blog.user.username

  const removeSelf = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
    }
  }

  const toggleVisibility = () => {
    setIsActive(!isActive)
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  if (isActive === false) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => toggleVisibility()}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => toggleVisibility()}>hide</button>
      <br />
      {blog.url}
      <br />
      likes {blog.likes}
      <button onClick={() => handleLike()}>like</button>
      <br />
      {blog.user.name}
      <br />
      {showRemoveButton && <button onClick={() => removeSelf()}>remove</button>}
    </div>
  )
}

export default Blog
