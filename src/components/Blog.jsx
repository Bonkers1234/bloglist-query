
import { useState } from 'react'

const Blog = ({ blog, likeBlogMutation, canRemove, removeBlogMutation }) => {
  const [visible, setVisible] = useState(false)

  const removeBlog = (blog) => {
    if(window.confirm(`Are you sure you want to remove '${blog.title}' by '${blog.author}'?`)) {
      removeBlogMutation.mutate(blog)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} - {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'show'}
      </button>
      {visible &&
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}<button onClick={() => likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1, user: blog.user.id })}>like</button></div>
          <div>{blog.user.name}</div>
          {canRemove && <button onClick={() => removeBlog(blog)}>delete</button>}
        </div>
      }
    </div>
  )
}


export default Blog