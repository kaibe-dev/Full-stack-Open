const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findByIdAndDelete(request.params.id)
  if (!blogToDelete) {
    return response.status(404).end()
  }
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