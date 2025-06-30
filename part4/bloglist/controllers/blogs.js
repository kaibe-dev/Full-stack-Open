const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user
  const blog = new Blog({
    title,
    author,
    user,
    url,
    likes,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (user._id.toString() !== blogToDelete.user.toString()) {
    return response.status(401).json({ error: 'unauthrorized' })
  }

  await blogToDelete.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const foundBlog = await Blog.findById(request.params.id)
  const body = request.body

  foundBlog.title = body.title
  foundBlog.author = body.author
  foundBlog.url = body.url
  foundBlog.likes = body.likes

  updatedBlog = await foundBlog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter