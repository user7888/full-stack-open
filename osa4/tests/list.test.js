const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')

const testList = [
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

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that blog', () => {
    expect(listHelper.totalLikes([testList[0]])).toBe(testList[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(testList)).toBe(36)
  })
})

describe('the most liked blog', () => {
  test('of an empty list cant be calculated and the test returns a string', () => {
    expect(listHelper.favouriteBlog([])).toEqual('List of blogs was empty')
  })

  test('when the list has only one blog, the most liked blog is equal to that blog', () => {
    testBlog = {
      title: testList[0].title,
      author: testList[0].author,
      likes: testList[0].likes
    }
    expect(listHelper.favouriteBlog([testList[0]])).toEqual(testBlog)
  })

  test('of a bigger list is calculated right', () => {
    testBlog = {
      title: testList[2].title,
      author: testList[2].author,
      likes: testList[2].likes
    }
    expect(listHelper.favouriteBlog(testList)).toEqual(testBlog)
  })
})

describe('Author with most blogs', () => {
  test('when the list is empty', () => {
    expect(listHelper.mostBlogs([])).toEqual('List of blogs was empty')
  })

  test('when the list has only one blog should be equal to author of that blog', () => {
    testBlog = {
      author: testList[0].author,
      blogs: 1
    }
    expect(listHelper.mostBlogs([testList[0]])).toEqual(testBlog)
  })

  test('from a bigger list is calculated correctly', () => {
    testBlog = {
      author: "Robert C. Martin",
      blogs: 3
    }
    expect(listHelper.mostBlogs(testList)).toEqual(testBlog)
  })
})

describe('Author with most likes', () => {
  test('when the list is empty', () => {
    expect(listHelper.mostLikes([])).toEqual('List of blogs was empty')
  })

  test('when the list has only one blog should equal to author of that blog', () => {
    testBlog = {
      author: testList[0].author,
      likes: 7
    }
    expect(listHelper.mostLikes([testBlog])).toEqual(testBlog)
  })

  test('from a bigger list is calculated correctly', () => {
    testBlog = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    expect(listHelper.mostLikes(testList)).toEqual(testBlog)
  })
})

afterAll(() => {
  mongoose.connection.close()
})