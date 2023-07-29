import propTypes from 'prop-types'
import React, { useState } from 'react'

const BlogForm = ({ handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    handleAddBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog} noValidate={true}>
        <div>
          title:
          <input
            id='title'
            type="title"
            value={title}
            name="Title"
            placeholder="Title.."
            onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          author:
          <input
            id='author'
            type="author"
            value={author}
            name="Author"
            placeholder="Author.."
            onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          url:
          <input
            id='url'
            type="url"
            value={url}
            name="Url"
            placeholder="Url.."
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button id="create" type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleAddBlog: propTypes.func.isRequired
}

export default BlogForm