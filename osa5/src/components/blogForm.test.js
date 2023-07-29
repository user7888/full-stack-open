import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Blog form passes correct values to callback function', async () => {
  const handleAddBlog = jest.fn()

  render(<BlogForm handleAddBlog={handleAddBlog}/>)

  const titleInput = screen.getByPlaceholderText('Title..')
  const authorInput = screen.getByPlaceholderText('Author..')
  const urlInput = screen.getByPlaceholderText('Url..')
  const createButton = screen.getByText('create')
  const user = userEvent.setup()

  await user.type(titleInput, 'test title')
  await user.type(authorInput, 'test author')
  await user.type(urlInput, 'www.test.com')

  await user.click(createButton)

  expect(handleAddBlog.mock.calls).toHaveLength(1)
  expect(handleAddBlog.mock.calls[0][0].title).toBe('test title' )
  expect(handleAddBlog.mock.calls[0][0].author).toBe('test author' )
  expect(handleAddBlog.mock.calls[0][0].url).toBe('www.test.com' )
})