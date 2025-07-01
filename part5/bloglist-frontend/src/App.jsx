import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [notification, setNotification] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleBlogSubmission = async (Event) => {
    Event.preventDefault()
    try {
      const blog = {
        user: user,
        title: blogTitle,
        author:blogAuthor,
        url:blogUrl
      }
      const addedBlog = await blogService.create(blog)
      setBlogs(blogs.concat(addedBlog))
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')

      setNotification('Blog Added')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (error) {
      console.log(error)
      setNotification('ERROR: Missing required fields')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />
        <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification} />
      <h1>Bloglist</h1>
      <p>Logged in as {user.name}</p>
      <button onClick={handleLogout}>logout</button>
      <Blogs blogs={blogs}/>
      <BlogForm
      blogTitle={blogTitle}
      blogAuthor={blogAuthor}
      blogUrl={blogUrl}
      setBlogTitle={setBlogTitle}
      setBlogAuthor={setBlogAuthor}
      setBlogUrl={setBlogUrl}
      handleBlogSubmission={handleBlogSubmission}
      />
    </div>
  )
}

export default App