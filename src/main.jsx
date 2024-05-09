import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './reducers/notificationReducer'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
)