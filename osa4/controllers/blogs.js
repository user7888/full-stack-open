const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  // catching errors without defining variables outside try/catch
  let decodedToken = undefined
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch(exception) {
    console.log(exception)
 // cleaner way?
    next(exception)
    return
  }
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes
  })

  if (body.likes === undefined) {
    blog.likes = 0
  }

  if (body.title === undefined && body.url === undefined) {
    return response.status(400).end()
  }
  
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    //console.log(exception)
    next(exception)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  let decodedToken = undefined
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch(exception) {
    next(exception)
    return
  }

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === decodedToken.id.toString()) {
    try {
      console.log('Deleting blog..', blog)
      console.log('User doing the deleting is..', decodedToken)
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } catch (exception) {
      next(exception)
    }
  } else {
    response.status(401).json({error: 'user has no authorization to delete this document'})
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }

  try {
    let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
