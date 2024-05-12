
import { useState } from 'react'
import { useUserLogin } from '../reducers/userReducer'

const LoginForm = ({ notifyWith }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginUser = useUserLogin()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      loginUser({ username, password })
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