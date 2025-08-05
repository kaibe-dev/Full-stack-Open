import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Books = (props) => {
  const allBooksResult = useQuery(ALL_BOOKS)
  const [getFilteredBooks, filteredBooksResult] = useLazyQuery(ALL_BOOKS)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)

  useEffect(() => {
    if (!allBooksResult.loading) {
      const genreData = [...new Set(allBooksResult.data.allBooks.flatMap(book => book.genres))]
      setGenres(genreData)
    }
  }, [allBooksResult.data, allBooksResult.loading])

  const handleFilterChange = (filter) => {
    setSelectedGenre(filter)
    getFilteredBooks({ variables: { genre: filter } })
  }

  const resetFilter = async () => {
    setSelectedGenre(null)
  }
  
  if (!props.show) {
    return null
  }
  
  if (filteredBooksResult.loading || allBooksResult.loading) {
    return <div>loading...</div>
  }

  const books = selectedGenre && filteredBooksResult.data 
    ? filteredBooksResult.data.allBooks 
    : allBooksResult.data.allBooks

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