import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification
  })

  if (notification === null) {
    return null
  }

  if (notification.includes('ERROR')) {
    return <div className="error">{notification}</div>
  }

  return <div className="success">{notification}</div>
}

export default Notification
