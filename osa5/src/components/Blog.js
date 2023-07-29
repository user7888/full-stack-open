import { useState } from 'react'

const Blog = ({ blog, user, handleLikeButton, handleRemoveButton }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailed, setDetailed] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')

  const toggleDetailed = () => {
    console.log('view toggle clicked')
    if (detailed === false) {
      setButtonLabel('hide')
    } else if (detailed === true) {
      setButtonLabel('view')
    }
    setDetailed(!detailed)
  }

  const removeBlog = () => {
    const answer = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (answer) {
      handleRemoveButton(blog)
    } else {
      return
    }
  }

  const removeButton = () => {
    if (!user) {
      return
    } else if (blog.user.username === user.username) {
      return (
        <button onClick={removeBlog}>remove</button>
      )
    } else {
      return
    }
  }

  const updateLikes = () => {
    console.log('blog id:', blog.id)
    const updatedBlog = {
      id: blog.id,
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    handleLikeButton(updatedBlog)
  }


  const showSimple = () => {
    return (
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetailed}>{buttonLabel}</button>
      </div>
    )
  }

  const showDetailed = () => {
    return (
      <div className="blog" style={blogStyle}>
        <p>
          {blog.title} {blog.author} <button onClick={toggleDetailed}>{buttonLabel}</button><br/>
          {blog.url}<br/>
          Likes {blog.likes} <button onClick={updateLikes}>like</button><br/>
          {blog.author}<br/>
          {removeButton()}
        </p>
      </div>
    )
  }

  // Conditional rendering using && operator.
  return (
    <div className="blogstyle">
      {detailed === false
        ? showSimple()
        : showDetailed()
      }
    </div>
  )
}


export default Blog