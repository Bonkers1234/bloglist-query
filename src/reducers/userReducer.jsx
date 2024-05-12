
import { createContext, useReducer, useContext } from 'react'
import loginService from '../services/login'

const userReducer = (state, action) => {
  switch(action.type) {
  case 'SET':
    return action.payload
  case 'CLEAR':
    return null
  default:
    return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const valueAndDispatch = useContext(UserContext)
  const value = valueAndDispatch[0]
  return value
}

export const useUserSet = () => {
  const valueAndDispatch = useContext(UserContext)
  const dispatch = valueAndDispatch[1]
  return () => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const userInfo = JSON.parse(loggedUserJSON)
      dispatch({ type: 'SET', payload: userInfo })
    }
  }
}

export const useUserLogout = () => {
  const valueAndDispatch = useContext(UserContext)
  const dispatch = valueAndDispatch[1]
  return () => {
    localStorage.removeItem('loggedBlogappUser')
    dispatch({ type: 'CLEAR' })
  }
}

export const useUserLogin = () => {
  const valueAndDispatch = useContext(UserContext)
  const dispatch = valueAndDispatch[1]
  return async (credentials) => {
    const userInfo = await loginService.login(credentials)
    localStorage.setItem('loggedBlogappUser', JSON.stringify(userInfo))
    dispatch({ type: 'SET', payload: userInfo })
  }
}

export default UserContext
