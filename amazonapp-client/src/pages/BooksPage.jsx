import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchBooks, fetchCategories } from '../api'
import { useCart } from '../CartContext'

function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [books, setBooks] = useState([])
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get('pageSize')) || 5
  )
  const [pageNum, setPageNum] = useState(
    Number(searchParams.get('pageNum')) || 1
  )
  const [sortOrder, setSortOrder] = useState(
    searchParams.get('sortOrder') || 'asc'
  )
  const [totalNumBooks, setTotalNumBooks] = useState(0)
  const [loading, setLoading] = useState(true)

  const [allCategories, setAllCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cats = searchParams.getAll('categories')
    return cats.length > 0 ? cats : []
  })

  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const { addToCart, cartItemCount, cartTotal } = useCart()

  useEffect(() => {
    fetchCategories()
      .then(setAllCategories)
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    const params = { pageSize: pageSize.toString(), pageNum: pageNum.toString(), sortOrder }
    const sp = new URLSearchParams(params)
    selectedCategories.forEach((cat) => sp.append('categories', cat))
    setSearchParams(sp, { replace: true })

    sessionStorage.setItem('lastBooksPage', `/?${sp.toString()}`)
  }, [pageSize, pageNum, sortOrder, selectedCategories])

  useEffect(() => {
    setLoading(true)
    fetchBooks(pageSize, pageNum, sortOrder, selectedCategories)
      .then((data) => {
        setBooks(data.books)
        setTotalNumBooks(data.totalNumBooks)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [pageSize, pageNum, sortOrder, selectedCategories])

  const totalPages = Math.ceil(totalNumBooks / pageSize)

  const toggleCategory = (cat) => {
    setPageNum(1)
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPageNum(1)
  }

  const handleAddToCart = (book) => {
    addToCart(book)
    setToastMessage(`"${book.title}" added to cart!`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <>
      <h1 className="mb-4">Book Collection</h1>

      {/* Cart Summary Card */}
      <div className="card bg-light mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <strong>Cart Summary:</strong>{' '}
            {cartItemCount === 0
              ? 'Your cart is empty'
              : `${cartItemCount} item${cartItemCount !== 1 ? 's' : ''} in cart`}
          </div>
          {cartItemCount > 0 && (
            <div className="fw-bold text-success">
              Total: ${cartTotal.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {/* Category filter sidebar */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>Categories</strong>
              {selectedCategories.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              )}
            </div>
            <ul className="list-group list-group-flush">
              {allCategories.map((cat) => (
                <li key={cat} className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`cat-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <label className="form-check-label" htmlFor={`cat-${cat}`}>
                      {cat}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main book list */}
        <div className="col-lg-9 col-md-8">
          <div className="row g-3 align-items-end mb-4">
            <div className="col-sm-4">
              <label className="form-label">Results per page</label>
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageNum(1)
                  setPageSize(Number(e.target.value))
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <div className="col-sm-4">
              <label className="form-label">Sort by title</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => {
                  setPageNum(1)
                  setSortOrder(e.target.value)
                }}
              >
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>ISBN</th>
                      <th>Classification</th>
                      <th>Category</th>
                      <th>Pages</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.bookId}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.isbn}</td>
                        <td>{book.classification}</td>
                        <td>{book.category}</td>
                        <td>{book.numberOfPages}</td>
                        <td>${Number(book.price).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAddToCart(book)}
                          >
                            Add to Cart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex gap-2 align-items-center mt-3">
                <button
                  className="btn btn-outline-primary"
                  disabled={pageNum === 1}
                  onClick={() => setPageNum(pageNum - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {pageNum} of {totalPages || 1}
                </span>
                <button
                  className="btn btn-outline-primary"
                  disabled={pageNum >= totalPages}
                  onClick={() => setPageNum(pageNum + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bootstrap Toast (#notcoveredinthevideos feature #1) */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1055 }}
      >
        <div
          className={`toast align-items-center text-bg-success border-0${showToast ? ' show' : ''}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BooksPage
