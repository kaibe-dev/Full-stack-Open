import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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

  const handleSearchChange = (Event) => {
    setFilter(Event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} handler={handleSearchChange} />
      <h2>Add a new entry</h2>
      <PersonForm 
        name={newName}
        nameHandler={handleNameChange}
        number={newNumber}
        numberHandler={handleNumberChange}
        submit={addName}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App