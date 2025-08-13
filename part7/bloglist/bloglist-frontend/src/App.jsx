import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/allUsersReducer'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

const App = () => {
  const loggedUser = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  const padding = {
    padding: 5,
  }

  const headerStyle = {
    backgroundColor: '#cccccc',
  }

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(initializeUser(user))
    }
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setNotification('Logout Succesful', 5))
  }

  if (loggedUser === null) {
    return (
      <div>
        <Notification />
        <h1>Bloglist</h1>
        <Togglable buttonLabel="login">
          <LoginForm />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <div>
        <header style={headerStyle}>
          <Link style={padding} to="/">
            Blogs
          </Link>
          <Link style={padding} to="/users">
            Users
          </Link>
          <span style={padding}>
            <b>Logged in as {loggedUser.name}</b>
          </span>
          <button onClick={handleLogout}>logout</button>
        </header>
      </div>

      <div>
        <Notification />
        <h1>Bloglist</h1>
      </div>

      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </div>
  )
}

export default App
