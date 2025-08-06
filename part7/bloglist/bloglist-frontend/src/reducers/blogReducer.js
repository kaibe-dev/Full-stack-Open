import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    },
    removeBlog(state, action) {
      const idToDelete = action.payload
      return state.filter((blog) => blog.id !== idToDelete)
    },
  },
})

export const { appendBlog, setBlogs, updateBlog, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
      dispatch(
        setNotification(`Created blog ${newBlog.title} by ${newBlog.author}`, 5)
      )
      return true
    } catch (error) {
      console.error('Failed to create blog:', error.response)
      const errorMessage = error.response.data.error
      const errorCode = error.response.status
      dispatch(setNotification(`ERROR ${errorCode}: ${errorMessage}`, 5))
      return false
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(updateBlog(updatedBlog))
    await blogService.update(blog.id, updatedBlog)
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      dispatch(removeBlog(blog.id))
      await blogService.remove(blog.id)
    } catch (error) {
      dispatch(appendBlog(blog))
      console.log(error.response)
    }
  }
}

export default blogSlice.reducer
