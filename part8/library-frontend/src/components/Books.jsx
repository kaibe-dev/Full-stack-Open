import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Books = (props) => {
  const allBooksResult = useQuery(ALL_BOOKS)
  const [genres, setGenres] = useState('')
  const [filter, setFilter] = useState('')
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: filter ? { genre: filter } : {}
  })

  useEffect(() => {
    if (!allBooksResult.loading) {
      const bookData = allBooksResult.data.allBooks
      const genreData = [...new Set(bookData.flatMap(book => book.genres))]
      setGenres(genreData)
    }
  }, [allBooksResult])

  const handleFilterChange = async (filter) => {
    setFilter(filter)
  }

  const resetFilter = async () => {
    setFilter('')
  }
  
  if (!props.show) {
    return null
  }
  
  if (filteredBooksResult.loading) {
    return <div>loading...</div>
  }

  const books = filteredBooksResult.data.allBooks || []

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button 
            key={genre}
            onClick={() => handleFilterChange(genre)}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => resetFilter()}>all genres</button>
      </div>
    </div>
  )
}

export default Books