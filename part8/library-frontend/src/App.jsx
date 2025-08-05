import { useEffect, useState } from "react"
import { useApolloClient, useSubscription } from "@apollo/client"
import { ALL_BOOKS, BOOK_ADDED } from "./queries"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    if (data) {
      const allBooks = data.allBooks
      return {
        allBooks: uniqByTitle(allBooks.concat(addedBook))
      }
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setPage("authors")
  },[token])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      addedBook.genres.forEach((element) => {
        updateCache(client.cache, {query: ALL_BOOKS, variables: { genre: element } }, addedBook)
      })
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    } 
  })
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  
  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>

        <Authors show={page === "authors"} />

        <Books show={page === "books"} />

        <LoginForm show={page ==="login"} setToken={setToken} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <button onClick={() => logout()}>logout</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === 'recommend'} />
    </div>
  );
};

export default App
