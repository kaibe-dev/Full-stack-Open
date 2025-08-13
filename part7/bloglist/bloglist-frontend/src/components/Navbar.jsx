import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
      <Link style={padding} to="/">
        Blogs
      </Link>
      <Link style={padding} to="/users">
        Users
      </Link>
      <p>Logged in as {loggedUser.name}</p>
      <button onClick={handleLogout}>logout</button>
    </nav>
  )
}

export default Navbar
