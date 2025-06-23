const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const testBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog likes equal the likes of that blog', () => {
    const blogs = [testBlogs[0]]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 7)  
  })

  test('large list is calculated succesfully', () => {
    const result = listHelper.totalLikes(testBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favourite blog', () => {

  test('empty list should return an empty object', () => {
    assert.deepStrictEqual(listHelper.favouriteBlog([]), {})
  })

  test('list with one blog should return that blog', () => {
    assert.deepStrictEqual(listHelper.favouriteBlog([testBlogs[0]]), testBlogs[0])
  })

  test('large list is calculated succesfully', () => {
    assert.deepStrictEqual(listHelper.favouriteBlog(testBlogs), testBlogs[2])
  })
})

describe('most blogs', () => {
  test('empty list should return an empty object', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), {})
  })

  test('list with one blog should return the author of that blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([testBlogs[0]]), 
      {
        author: "Michael Chan",
        blogs: 1
      }
    )
  })

  test('large list calculated succesfully', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(testBlogs),
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    )
  })
})

describe('most likes', () => {
  test('empty list should return an empty object', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), {})
  })

  test('list with one blog should return the author of that blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes([testBlogs[0]]), 
      {
        author: "Michael Chan",
        likes: 7
      }
    )
  })

  test('large list calculated succesfully', () => {
    assert.deepStrictEqual(listHelper.mostLikes(testBlogs),
      {
        author: "Edsger W. Dijkstra",
        likes: 17
      }
    )
  })
})