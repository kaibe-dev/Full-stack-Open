import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(inialPersons => {
        setPersons(inialPersons)
      })
  }, [])

  const addPerson = (Event) => {
    Event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    const foundPerson = persons.find(person => person.name === newName)

    if (foundPerson) {
      const result = confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`) 
      if (result === true) {
        const updatedPerson = {...foundPerson, number: newNumber}
        personService
          .update(foundPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map (person => 
              person.id !== foundPerson.id ? person : returnedPerson))
            setSuccessMessage(
            `Updated ${returnedPerson.name} with the number ${returnedPerson.number}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setSuccessMessage(
            `Added ${newPerson.name} with the number ${newPerson.number}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
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

  const deletePerson = id => {
    personService
      .remove(id)
      .then((deletedPerson) => {
        setPersons(persons.filter(person => person.id !== id))
        setSuccessMessage(
          `User ${deletedPerson.name} deleted succesfully`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
  }
  
  
  return (
    <div>
      <h1>Phonebook</h1>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filter={filter} handler={handleSearchChange} />
      <h2>Add a new entry</h2>
      <PersonForm 
        name={newName}
        nameHandler={handleNameChange}
        number={newNumber}
        numberHandler={handleNumberChange}
        submit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App