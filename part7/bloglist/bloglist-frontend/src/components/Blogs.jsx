import { useRef } from 'react'
import BlogList from './BlogList'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

const Blogs = () => {
  const blogFormRef = useRef()

  const toggleVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm handleSuccess={toggleVisibility} />
      </Togglable>
      <BlogList />
    </div>
  )
}

export default Blogs
