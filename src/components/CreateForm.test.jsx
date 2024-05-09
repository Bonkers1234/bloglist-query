
import React from 'react'
import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import CreateForm from './CreateForm'
import userEvent from '@testing-library/user-event'

test('When blog is created callback has correct data', async () => {
  const createMock = jest.fn()
  render(<CreateForm createBlog={createMock} />)

  const newBlog = {
    author: 'Bob',
    title: 'Something new',
    url: 'www.site.com',
    likes: 0
  }

  const user = userEvent.setup()

  const authorInput = screen.getByPlaceholderText('Author')
  await user.type(authorInput, newBlog.author)

  const titleInput = screen.getByPlaceholderText('Title')
  await user.type(titleInput, newBlog.title)

  const urlInput = screen.getByPlaceholderText('Url')
  await user.type(urlInput, newBlog.url)

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createMock.mock.calls[0][0]).toEqual(newBlog)
})