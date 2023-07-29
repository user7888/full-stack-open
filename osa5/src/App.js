import Blog from './components/Blog'
import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
//import LoginForm from './components/LoginForm'

// Tarvitaan
// Login view
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  // temp comment out
  //const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()

  // Sort blogs by amount of likes.
  useEffect(() => {
    blogService.getAll().then(blogs => {
      const blogsSorted = blogs.sort( compareFunction ).reverse()
      setBlogs( blogsSorted )
    })
  //  Blogs get sorted by likes when
  // blogs array is added here. When the
  // array is empty, the sorting doesn't work.
  // Why?
  }, [blogs])

  // useEffect(() => {
  //   blogService.getAll().then(blogs =>
  //     setBlogs( blogs )
  //   )
  // }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log(`found user from local storage: ${loggedUserJSON}`)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // aiheuttaa uudelleen renderöinnin ja efektin suorituksen
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  // Login function
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      console.log('print in handleLogin:', user)
      setUsername('')
      setPassword('')
      notifications(`User ${user.name} logged in`)
    } catch (exception) {
      console.log('error..', exception)
      // We are getting this error...
      notifications('wrong username or password')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken('none')
    window.localStorage.removeItem('loggedBlogappUser')
    console.log(`token on: ${user.token}`)
    notifications('Logged out')
  }

  const handleAddBlog = async ( blogObject ) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      notifications(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch (exception) {
      console.log('error...', exception)
    }
  }

  const loginForm = () => {
    // const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    // const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div className="loginformstyle">
          <Notification message={notification}/>
          <h2>login to application</h2>
          <form onSubmit={handleLogin}>
            <div>
            username
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
            password
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      </div>
    )
    // return (
    //   <div>
    //   <div style={hideWhenVisible}>
    //     <button onClick={() => setLoginVisible(true)}>log in</button>
    //   </div>
    //   <div style={showWhenVisible}>
    //     <LoginForm
    //       username={username}
    //       password={password}
    //       handleUsernameChange={({ target }) => setUsername(target.value)}
    //       handlePasswordChange={({ target }) => setPassword(target.value)}
    //       handleSubmit={handleLogin}
    //     />
    //     <button onClick={() => setLoginVisible(false)}>cancel</button>
    //   </div>
    // </div>

    // )
  }

  const createBlogForm = () => (
    <Toggleable buttonLabel='create new' ref={blogFormRef}>
      <BlogForm handleAddBlog={handleAddBlog}/>
    </Toggleable>
  )

  const notifications = (notification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 2500)
  }

  const handleLikeButton = async ( blogObject ) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      // Key error axios .put
      // state update -> Blog component refresh render -> unique key error
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
      notifications(`added a new like for blog ${updatedBlog.title} by ${updatedBlog.author}`)
    } catch (exception) {
      console.log('error...', exception)
    }
  }

  const handleRemoveButton = async ( blogObject ) => {
    const deletedBlog = blogObject
    try {
      await blogService.remove(blogObject)
      setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id))
      notifications(`deleted a blog named ${deletedBlog.title} by ${deletedBlog.author}`)
    } catch (exception) {
      console.log('error...', exception)
    }
  }

  const compareFunction = (a, b) => {
    if (a.likes < b.likes) {
      return -1
    }
    if (a.likes > b.likes) {
      return 1
    }
    return 0
  }

  return (
    <div>
      {user === null ?
        loginForm() :
        <div className="loginformstyle">
          <Notification message={notification}/>
          <h2>blogs</h2>
          <div>
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
            {createBlogForm()}
          </div>
        </div>
      }
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLikeButton={handleLikeButton}
          handleRemoveButton={handleRemoveButton}/>
        )}
    </div>
  )
}

export default App