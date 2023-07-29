import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// test('renders content', () => {
//   const note = {
//     content: 'Component testing is done with react-testing-library',
//     important: true
//   }

//   render(<Note note={note} />)

//   const element = screen.getByText('Component testing is done with react-testing-library')
//   expect(element).toBeDefined()
// })

test('blog title & author are rendered but url & likes are not', () => {
  const blog = {
    title: 'Title of blog',
    author: 'Author',
    url: 'www.pagename.com',
    likes: 5
  }

  render(
    <Blog blog={blog} />
  )

  const titleElement = screen.getByText('Title of blog', { exact: false })
  const authorElement = screen.getByText('Author', { exact: false })
  const urlElement = screen.queryByText('www.pagename.com', { exact: false })
  const likesElement = screen.queryByText('5', { exact: false })

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('after view button is pressed url & likes are displayed', async () => {
  const blog = {
    title: 'Title of blog',
    author: 'Author',
    url: 'www.pagename.com',
    likes: 5
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.queryByText('www.pagename.com', { exact: false })
  const likesElement = screen.queryByText('5', { exact: false })

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

// TODO: like button 2 times, blog form tests

test('like button for blogs works', async () => {
  const blog = {
    title: 'Title of blog',
    author: 'Author',
    url: 'www.pagename.com',
    likes: 5
  }

  const mockHandler = jest.fn()


  render(
    <Blog blog={blog} handleLikeButton={mockHandler} />
  )


  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  const likesElement = screen.queryByText('Likes 2', { exact: false })
  expect(likesElement).toBeDefined()
  expect(mockHandler.mock.calls).toHaveLength(2)
})

