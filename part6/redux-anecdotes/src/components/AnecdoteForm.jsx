import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const NewAnecdote = () => {
  const dispatch = useDispatch()
  
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('create ', content)
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>create new</h2>
        <form onSubmit={addAnecdote}>
          <div><input name='anecdote'/></div>
          <button type='submit'>create</button>
        </form>
        <br />
    </div>
  )
}

export default NewAnecdote