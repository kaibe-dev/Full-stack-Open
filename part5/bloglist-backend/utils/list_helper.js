const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((maxBlog, blog) => blog.likes > maxBlog.likes ? blog : maxBlog)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    let authorBlogCounts = {}
    blogs.forEach((blog) => {
      if (blog.author in authorBlogCounts) {
        authorBlogCounts[blog.author] += 1
      } else {
        authorBlogCounts[blog.author] = 1
      }
    })
    const authorWithMostBlogs = Object.keys(authorBlogCounts).reduce((maxBlogs, author) =>
      authorBlogCounts[maxBlogs] > authorBlogCounts[author] ? maxBlogs : author)
    const res = {
      author: authorWithMostBlogs,
      blogs: authorBlogCounts[authorWithMostBlogs]
    }
    return res
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    let authorLikeCounts = {}
    blogs.forEach((blog) => {
      if (blog.author in authorLikeCounts) {
        authorLikeCounts[blog.author] += blog.likes
      } else {
        authorLikeCounts[blog.author] = blog.likes
      }
    })
    const authorWithMostLikes = Object.keys(authorLikeCounts).reduce((maxBlogs, author) =>
      authorLikeCounts[maxBlogs] > authorLikeCounts[author] ? maxBlogs : author)
    const res = {
      author: authorWithMostLikes,
      likes: authorLikeCounts[authorWithMostLikes]
    }
    return res
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}