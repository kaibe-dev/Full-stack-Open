import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isActive, setIsActive] = useState(false)

  const showRemoveButton = user.username === blog.user.username

  const addLike = () => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      updateBlog(updatedBlog)
    } catch (error) {
      console.log(error)
    }
  }

  const removeSelf = () => {
    deleteBlog(blog.id)
  }


  const toggleVisibility = () => {
    setIsActive(!isActive)
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
      <button onClick={() => toggleVisibility()}>hide</button><br />
      {blog.url}<br />
      likes {blog.likes}
      <button onClick={() => addLike()}>like</button><br />
      {blog.user.name}<br />
      {showRemoveButton && <button onClick={() => removeSelf()}>remove</button> }
    </div>
  )
}

export default Blog