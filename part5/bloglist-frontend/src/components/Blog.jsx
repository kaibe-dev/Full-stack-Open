import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isActive, setIsActive] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const showRemoveButton = user.username === blog.user.username

  const addLike = async () => {
    try {
      setLikes(likes + 1)
      const updatedBlog = { ...blog, likes: likes + 1 }
      const idToUpdate = blog.id
      const result = await blogService.update(idToUpdate, updatedBlog)
      console.log(result)
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
        {blog.title}
        <button onClick={() => toggleVisibility()}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={() => toggleVisibility()}>hide</button> <br />
      {blog.url} <br />
      likes {likes}
      <button onClick={() => addLike()}>like</button> <br />
      {blog.user.name} <br />
      {showRemoveButton && <button onClick={() => removeSelf()}>remove</button> }
    </div>
  )
}

export default Blog