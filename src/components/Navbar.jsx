import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      {' | '}
      <Link to="/problems">Problems</Link>
      {' | '}
      <Link to="/add">Add Problem</Link>
    </nav>
  )
}

export default Navbar