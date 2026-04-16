import { Routes, Route, NavLink } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import AdminBooksPage from './pages/AdminBooksPage'

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Amazon Bookstore
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/adminbooks">
                  Admin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
