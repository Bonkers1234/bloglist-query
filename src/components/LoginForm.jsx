
import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setUser, notifyWith }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userInfo = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userInfo))
      blogService.setToken(userInfo.token)
      setUser(userInfo)
      setUsername('')
      setPassword('')
      notifyWith('Welcome')
    } catch(exception) {
      setUsername('')
      setPassword('')
      notifyWith(exception.response.data.error, 'error')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
                    username
          <input
            type="text"
            name="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
                    password
          <input
            type="password"
            name="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm