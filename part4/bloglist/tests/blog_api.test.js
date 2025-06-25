const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('api tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have the correct id field', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert(blog.hasOwnProperty('id'))
    })
  })

  test('blogs can be added', async () => {
    const newBlog = {
      "title": "test valid blog",
      "author": "test valid author",
      "url": "test valid url",
      "likes": "1"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes(newBlog.title))
  })

  test('blogs with no like field given will default to 0', async () => {
    const newBlog = {
      "title": "test no like field",
      "author": "test valid author",
      "url": "test valid url"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(addedBlog.likes, 0)
    
  })

  test('blogs with no title result in code 400', async () => {
    const newBlog = {
      "author": "test valid author",
      "url": "test valid url"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('blogs with no url result in code 400', async () => {
    const newBlog = {
      "title": "test valid blog",
      "author": "test valid author",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })  
})

after(async () => {
  await mongoose.connection.close()
})
