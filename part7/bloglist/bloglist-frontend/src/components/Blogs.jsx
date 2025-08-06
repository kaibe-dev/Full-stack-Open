import Blog from './Blog'
import { useSelector } from 'react-redux'

const Blogs = ({ user }) => {
  const blogs = useSelector(({ blogs }) => blogs)
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div data-testid="allblogs">
      <h2>Blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default Blogs
