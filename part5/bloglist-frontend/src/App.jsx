import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import axios from 'axios'

const App = () => {
  const [notification, setNotification] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs ),
    )
  }, [])

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
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotification('Login Succesful')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (exeption) {
      console.log('wrong credentials')
      setNotification('ERROR: Wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)

    setNotification('Logout Succesful')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))

      setNotification('Blog Added')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (error) {
      console.log(error.response)
      const errorMessage = error.response.data.error
      const errorCode = error.response.status

      if (errorMessage === 'token expired') {
        setNotification('ERROR: Session expired, please log in again')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        window.localStorage.removeItem('loggedBloglistUser')
        setUser(null)
      } else if (errorCode === 401) {
        setNotification('ERROR: Invalid token')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        window.localStorage.removeItem('loggedBloglistUser')
        setUser(null)
      }
    }
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const idToUpdate = updatedBlog.id
      setBlogs(blogs.map(blog => blog.id === idToUpdate ? updatedBlog : blog))
      await blogService.update(idToUpdate, updatedBlog)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const blogToDelete = blogs.find((blog) => blog.id === id)
      if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
        setBlogs(blogs.filter(blog => blog.id !== id))
        await blogService.remove(id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />
        <h1>Bloglist</h1>
        <Togglable buttonLabel='login'>
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
      <Notification message={notification} />
      <h1>Bloglist</h1>
      <p>Logged in as {user.name}</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} user={user}/>
      </Togglable>
      <Blogs
        blogs={blogs}
        user={user}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog} />
    </div>
  )
}

export default App