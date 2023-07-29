const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')
const { config } = require('dotenv')
const blogs = require('../models/blogs')
const bcrypt = require('bcrypt')
const User = require('../models/users')
// run tests: npm test -- tests/blog_api.test.js
const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxZjgyMmM4ZmVkN2IxMmFhOTJiNTQ5MyIsImlhdCI6MTY0MzgwMDQzM30.wEFtCx2e-0om9L89SD9zirKUv-oy1hLEEY6SUrf9zNA'

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  expect(response.type).toBe('application/json')
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the author of first blog is Michael Chan', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].author).toBe(helper.initialBlogs[0].author)
})

test('id field is named correctly', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body[0])
  expect(response.body[0].id).toBeDefined()
})

test('adding a new blog to database works correctly', async () => {
  const testBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    user: "61f822c8fed7b12aa92b5493",
    likes: 2
  }

  await api.post('/api/blogs')
    .send(testBlog)
    .set('Authorization', token)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd)
  console.log(helper.initialBlogs.length)
  console.log(blogsAtEnd[2])
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('ensure that value of likes is 0 even if no value was given', async () => {
 const testBlog = {
  title: "Type warsz",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  user: "61f822c8fed7b12aa92b5493",
  }

  await api.post('/api/blogs')
    .send(testBlog)
    .set('Authorization', token)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[2].likes).toBe(0)
})

test('if title and url properties are missing server responds with status code 400', async () => {
  const testBlog = {
    author: "Robert C. Martin",
    user: "61f822c8fed7b12aa92b5493",
    likes: 2
  }
  
  await api
    .post('/api/blogs')
    .send(testBlog)
    .set('Authorization', token)
    .expect(400)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a note can be deleted', async () => {
  await api
    .delete('/api/blogs/5a422a851b54a676234d17f7')
    .set('Authorization', token)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
})

test('likes field can be updated', async () => {
  const testBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    user: "61f822c8fed7b12aa92b5493",
    likes: 100
  }

  await api
    .put('/api/blogs/5a422a851b54a676234d17f7')
    .send(testBlog)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[0].likes).toBe(testBlog.likes)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ 
      _id: "61f822c8fed7b12aa92b5493",
      username: 'root',
      name: "Matti Luukkainen",
      passwordHash: passwordHash,
      blogs: [
        "5a422aa71b54a676234d17f8",
        "5a422a851b54a676234d17f7"
      ]
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'luukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    console.log(usersAtEnd)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(500)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username already exists!')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with a proper statuscode and message if username is not valid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nn',
      name: 'Jacques',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with a proper statuscode and message if password is not valid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user115',
      name: 'Jacques',
      password: 'nn',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('adding a new blog fails if token is missing from the request', async () => {
    const testBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      user: "61f822c8fed7b12aa92b5493",
      likes: 2
    }

    await api.post('/api/blogs')
      .send(testBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})