import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'

const User = () => {
  const match = useMatch('/users/:id')
  const user = useSelector(({ allUsers }) =>
    allUsers.find((user) => user.id === match.params.id)
  )

  if (user === null) {
    return <div>loading...</div>
  }
  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default User
