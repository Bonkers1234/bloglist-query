
import React from 'react'
import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    author: 'Theodore',
    title: 'Blogcheck',
    url: 'www.mywebsite.com',
    likes: 0,
    user: { name: 'Charles' }
  }

  const likeHandler = jest.fn()

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        remove={jest.fn()}
        canRemove={true}
        blogLike={likeHandler}
      />
    )
  })

  test('Renders "title" and "author" but NOT "url" or "likes"', () => {
    screen.getByText(blog.author, { exact: false })
    screen.getByText(blog.title, { exact: false })

    const urlElement = screen.queryByText(blog.url, { exact: false })
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText(blog.likes, { exact: false })
    expect(likesElement).toBeNull()
  })

  test('Displays "url" and "likes" when button is clicked', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    screen.getByText(blog.url, { exact: false })
    screen.getByText(`likes ${blog.likes}`, { exact: false })
  })


  test('If liked twice, the event handler registers correct number', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})








