import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const getRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const copyVotes = [...votes]
    copyVotes[selected] += 1
    console.log(copyVotes)
    setVotes(copyVotes)
  }

  const getMaxVotes = () => {
    let maxVotes = Math.max(...votes)
    let maxIndex = votes.indexOf(maxVotes)
    console.log("most votes:", maxVotes, "index" ,maxIndex)
    return {anecdote : anecdotes[maxIndex], votes : maxVotes}
  }

  const maxVotedAnecdote = getMaxVotes()

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {anecdotes[selected]}
        <br />
        has {votes[selected]} votes
        <br />
        <Button onClick={handleVote} text="vote" />
        <Button onClick={getRandomAnecdote} text="next anecdote" />
      </p>
      <h1>Anecdote with most votes</h1>
      <p>
        {maxVotedAnecdote.anecdote}
        <br />
        has {maxVotedAnecdote.votes} votes
      </p>
    </div>
  )
}

export default App