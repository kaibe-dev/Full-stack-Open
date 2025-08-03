import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'
import { useState, useEffect } from 'react'

const Recommendations = (props) => {
  const [favoriteGenre, setFavoriteGenre] = useState('')

  const userResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })

  useEffect(() => {
    if (!userResult.loading) {
      const favGenre = userResult.data.me.favoriteGenre
      setFavoriteGenre(favGenre)
    }
  }, [userResult])

  if (!props.show) {
    return null
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }
  console.log(userResult)
  const recommendedBooks = booksResult.data.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre <b>{favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th><b>title</b></th>
            <th><b>author</b></th>
            <th><b>published</b></th>
          </tr>
          {recommendedBooks.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations