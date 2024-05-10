
import { useState } from 'react'

const CreateForm = ({ createBlogMutation }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    createBlogMutation.mutate({ title, author, url, likes: 0 })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleCreate}>
      <h2>Create New Blog:</h2>
      <div>
                title
        <input
          type="text"
          name="Title"
          placeholder='Title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
                author
        <input
          type="text"
          name="Author"
          placeholder='Author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}/>
      </div>
      <div>
                url
        <input
          type="text"
          name="Url"
          placeholder='Url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}/>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateForm