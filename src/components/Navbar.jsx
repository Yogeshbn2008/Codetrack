import { Link } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      {' | '}
      <Link to="/problems">Problems</Link>
      {' | '}
      <Link to="/add">Add Problem</Link>
      {' | '}
      {user ? (
        <>
          <span>Hi, {user.name}</span>
          {' '}
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          {' | '}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar