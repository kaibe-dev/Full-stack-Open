const BlogForm = ({ blogTitle, blogAuthor, blogUrl, setBlogTitle, setBlogAuthor, setBlogUrl, handleBlogSubmission }) => {
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleBlogSubmission}>
        <div>
          title
          <input 
          type="text"
          value={blogTitle}
          name="Title"
          onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author
          <input 
          type="text"
          value={blogAuthor}
          name="Author"
          onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input 
          type="text"
          value={blogUrl}
          name="Url"
          onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm