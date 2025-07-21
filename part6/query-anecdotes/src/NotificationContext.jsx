import { createContext, useReducer, useContext } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "MESSAGE":
      return action.payload
    case "RESET":
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notifAndDispatch = useContext(NotificationContext)
  return notifAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notifAndDispatch = useContext(NotificationContext)
  return notifAndDispatch[1]
}

export default NotificationContext