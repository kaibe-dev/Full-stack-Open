const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)
mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  console.log("get request")
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  console.log("post request")
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})