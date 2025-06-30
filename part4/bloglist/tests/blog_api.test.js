const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.create(helper.initialUser)
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
      assert(Object.hasOwn(blog, 'id'))
    })
  })

  test('blogs can be added with valid authorization', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const newBlog = {
      'title': 'test valid blog',
      'author': 'test valid author',
      'url': 'test valid url',
      'likes': '1'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes(newBlog.title))
  })

  test('blogs cannot be added with invalid authorization', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'invalidpasswd' })

    const token = loginResponse.body.token

    const newBlog = {
      'title': 'test valid blog',
      'author': 'test valid author',
      'url': 'test valid url',
      'likes': '1'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('blogs with no like field given will default to 0', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const newBlog = {
      'title': 'test no like field',
      'author': 'test valid author',
      'url': 'test valid url'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(addedBlog.likes, 0)

  })

  test('blogs with no title result in code 400', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const newBlog = {
      'author': 'test valid author',
      'url': 'test valid url'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('blogs with no url result in code 400', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const newBlog = {
      'title': 'test valid blog',
      'author': 'test valid author',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('delete blog with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const idToDelete = blogsAtStart[0].id
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('trying to delete a blog with malformatted id', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const idToDelete = '5a422b991b54a7764d17fa'
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('trying to delete a blog with id that does not exist', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'testpasswd' })

    const token = loginResponse.body.token

    const idToDelete = '5a422b891b54a676234dffff'
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('blog cannot be updated without valid token', async() => {
    const blogsAtStart = await helper.blogsInDb()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testusername', password: 'wrongpasswd' })

    const token = loginResponse.body.token

    const idToDelete = blogsAtStart[0].id
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
  })


  test('update blog with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const idToUpdate = blogsAtStart[0].id
    const updatedContents = {
      title: 'updated title',
      author: 'updated author',
      url: 'updated url',
      likes: 99
    }

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updatedContents)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === idToUpdate)
    assert.strictEqual(updatedBlog.likes, updatedContents.likes)
  })

  test('update blog with invalid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const originalBlog = blogsAtStart[0]
    const idToUpdate = originalBlog.id
    const updatedContents = {
      author: 'updated author',
      url: 'updated url',
      likes: 99
    }

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updatedContents)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === idToUpdate)
    assert.strictEqual(updatedBlog.likes, originalBlog.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
