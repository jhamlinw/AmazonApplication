import { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import BooksPage from './pages/BooksPage'
import CartPage from './pages/CartPage'

function App() {
  const { cart, cartTotal, cartItemCount, removeFromCart } = useCart()
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const offcanvasRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (showOffcanvas) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showOffcanvas])

  const goToCart = () => {
    setShowOffcanvas(false)
    navigate('/cart')
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
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
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cart">
                  Cart
                </NavLink>
              </li>
            </ul>
            {/* Bootstrap Badge (#notcoveredinthevideos feature #1) */}
            <button
              className="btn btn-outline-light position-relative"
              onClick={() => setShowOffcanvas(true)}
            >
              Cart
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Bootstrap Offcanvas cart preview (#notcoveredinthevideos feature #2) */}
      {showOffcanvas && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowOffcanvas(false)}
        ></div>
      )}
      <div
        ref={offcanvasRef}
        className={`offcanvas offcanvas-end${showOffcanvas ? ' show' : ''}`}
        style={{ visibility: showOffcanvas ? 'visible' : 'hidden' }}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Cart Preview</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowOffcanvas(false)}
          ></button>
        </div>
        <div className="offcanvas-body">
          {cart.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            <>
              <ul className="list-group mb-3">
                {cart.map((item) => (
                  <li
                    key={item.bookId}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <div className="fw-bold">{item.title}</div>
                      <small className="text-muted">
                        {item.quantity} &times; ${Number(item.price).toFixed(2)}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              <div className="fw-bold mb-3">
                Total: ${cartTotal.toFixed(2)}
              </div>
              <button className="btn btn-primary w-100" onClick={goToCart}>
                View Full Cart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
