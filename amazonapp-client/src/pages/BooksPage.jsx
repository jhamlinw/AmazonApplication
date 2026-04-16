import { useEffect, useState } from 'react'
import { fetchBooks } from '../api'

function BooksPage() {
  const [books, setBooks] = useState([])
  const [pageSize, setPageSize] = useState(5)
  const [pageNum, setPageNum] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc')
  const [totalNumBooks, setTotalNumBooks] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchBooks(pageSize, pageNum, sortOrder)
      .then((data) => {
        setBooks(data.books)
        setTotalNumBooks(data.totalNumBooks)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [pageSize, pageNum, sortOrder])

  const totalPages = Math.ceil(totalNumBooks / pageSize)

  return (
    <>
      <h1 className="mb-4">Book Collection</h1>

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
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
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
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookID}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.isbn}</td>
                    <td>{book.classification}</td>
                    <td>{book.category}</td>
                    <td>{book.pageCount}</td>
                    <td>${Number(book.price).toFixed(2)}</td>
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
    </>
  )
}

export default BooksPage
