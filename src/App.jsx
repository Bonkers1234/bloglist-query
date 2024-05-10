import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService, { getAll, create, update, remove } from './services/blogs'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotify } from './reducers/notificationReducer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const [user, setUser] = useState(null)

  const createFormRef = useRef()

  const queryClient = useQueryClient()
  const blogsData = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const userInfo = JSON.parse(loggedUserJSON)
      setUser(userInfo)
      blogService.setToken(userInfo.token)
    }
  },[])

  const notifyWith = useNotify()

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out!')
  }

  const likeBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: (blog) => {
      const staleBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], staleBlogs.map(b => b.id === blog.id ? blog : b))
      notifyWith(`You liked '${blog.title}' by '${blog.author}'`)
    },
    onError: (error) => {
      notifyWith(error.response.data.error, 'error')
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: (blog) => remove(blog.id),
    onSuccess: (_, blog) => {
      const staleBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], staleBlogs.filter(b => b.id !== blog.id))
      notifyWith(`Blog '${blog.title}' by '${blog.author}' removed.`)
    },
    onError: (error) => {
      notifyWith(error.response.data.error, 'error')
    }
  })

  const createBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (blog) => {
      createFormRef.current.toggleVisibility()
      const staleBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], staleBlogs.concat(blog))
      notifyWith(`New blog '${blog.title}' by '${blog.author}' added!`)
    },
    onError: (error) => {
      notifyWith(error.response.data.error, 'error')
    }
  })

  if(blogsData.isLoading) {
    return <div>Loading data...</div>
  } else if(blogsData.isError) {
    return <div>There has been a problem retrieving data from server, wait then try again.</div>
  }

  const blogs = blogsData.data

  return (
    <div>
      <Notification />
      {!user && <LoginForm setUser={setUser} notifyWith={notifyWith} />}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={logout}>logout</button></p>
        <Togglable buttonLabel='new blog' ref={createFormRef} >
          <CreateForm
            createBlogMutation={createBlogMutation}
          />
        </Togglable>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            likeBlogMutation={likeBlogMutation}
            removeBlogMutation={removeBlogMutation}
            canRemove={user && blog.user.username === user.username}
          />
        )}
      </div>}
    </div>
  )
}

export default App