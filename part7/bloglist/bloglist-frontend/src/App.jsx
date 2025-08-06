import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (Event) => {
    Event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      dispatch(setNotification('Login Succesful', 5))
    } catch (exeption) {
      console.log('wrong credentials')
      dispatch(setNotification('ERROR: Wrong credentials', 5))
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    dispatch(setNotification('Logout Succesful', 5))
  }

  const toggleVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  const deleteBlog = async (id) => {
    try {
      const blogToDelete = blogs.find((blog) => blog.id === id)
      if (
        window.confirm(
          `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
        )
      ) {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        await blogService.remove(id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification />
        <h1>Bloglist</h1>
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h1>Bloglist</h1>
      <p>Logged in as {user.name}</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm user={user} handleSuccess={toggleVisibility} />
      </Togglable>
      <Blogs user={user} deleteBlog={deleteBlog} />
    </div>
  )
}

export default App
