const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
  let likes = 0

  if (blogs.length > 0) {
    blogs.forEach(blog => {
      likes += blog.likes
    })
    return likes
  } else {
    return 0
  }
}

const favouriteBlog = (blogs) => {
  let mostLikedBlog = blogs[0]

  if (blogs.length > 0) {
    blogs.forEach(blog => {
      if (blog.likes >= mostLikedBlog.likes) {
        mostLikedBlog = blog
      }
    })
    return {
      title: mostLikedBlog.title,
      author: mostLikedBlog.author,
      likes: mostLikedBlog.likes
    }
  } else {
    return 'List of blogs was empty'
  }
}

const mostBlogs = (blogs) => {
  let bloggers = []

  if (blogs.length > 0) {
    blogs.forEach(blog => {
      if (bloggers.find(x => x.author === blog.author) === undefined) {
        bloggers.push({
            author: blog.author,
            blogs: 1
        })
      } else {
        let foundIndex = bloggers.findIndex(x => x.author === blog.author)
        bloggers[foundIndex].blogs += 1
      }
    })
    return bloggers.reduce((max, blogger) => max.blogs > blogger.blogs ? max : blogger)
  }
  return 'List of blogs was empty'
}

const mostLikes = (blogs) => {
  let bloggers = []

  if (blogs.length > 0) {
    blogs.forEach(blog => {
      if (bloggers.find(x => x.author === blog.author) === undefined) {
        bloggers.push({
            author: blog.author,
            likes: blog.likes
        })
      } else {
        let foundIndex = bloggers.findIndex(x => x.author === blog.author)
        bloggers[foundIndex].likes += blog.likes
      }
    })
    console.log(bloggers.reduce((max, blogger) => max.blogs > blogger.blogs ? max : blogger)
    )
    return bloggers.reduce((max, blogger) => max.likes > blogger.likes ? max : blogger)
  }
  return 'List of blogs was empty'
}
module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}