import { useState } from 'react'

const Header = ({title}) => <h1>{title}</h1>

const Display = ({name, value}) => <p>{name} {value}</p>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header title="give feedback" />
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Header title="statistics" />
      <Display name="good" value={good} />
      <Display name="neutral" value={neutral} />
      <Display name="bad" value={bad} />
    </div>
  )
}

export default App