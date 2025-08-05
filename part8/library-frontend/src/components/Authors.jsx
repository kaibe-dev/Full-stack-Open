import { useState } from 'react'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState([])
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editBirthyear ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  useEffect(() => {
    if (!result.loading && result.data) {
      setAuthors(result.data.allAuthors)
    }
  }, [result.data, result.loading])

  const submit = async (event) => {
    event.preventDefault()

    editBirthyear( { variables: { name, setBornTo: parseInt(born) } })

    setName('')
    setBorn('')
  }
  
  if (!props.show) {
    return null
  }
  
  if (result.loading) {
    return <div>loading...</div>
  }
  
  const authorOptions = authors.map(author => ({
    value: author.name,
    label: author.name
  }))
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>  
        <Select options={authorOptions} onChange={(selectedOption) => setName(selectedOption.label)}></Select>
        <div>
          born
          <input 
            value={born}
            onChange={({ target }) => setBorn(target.value)}          
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}
Authors.propTypes = {
  show: PropTypes.bool.isRequired
}

export default Authors
