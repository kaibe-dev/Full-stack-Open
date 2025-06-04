import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (Event) => {
    Event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      
    } else {
      setPersons(persons.concat(nameObject))
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (Event) => {
    setNewName(Event.target.value)
  }

  const handleNumberChange = (Event) => {
    setNewNumber(Event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <h2>Add a new entry</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((person) => (
          <div>
            {person.name} {person.number}
          </div>
        ))}
      </div>
    </div>
  )

}

export default App