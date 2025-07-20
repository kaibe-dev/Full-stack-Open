import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})
export const { updateNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, timeInSeconds) => {
  const timeInMs = timeInSeconds * 1000
  return async dispatch => {
    dispatch(updateNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeInMs)
  }
}

export default notificationSlice.reducer