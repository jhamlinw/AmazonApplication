import { useEffect, useState } from 'react'

function App() {
  const [books, setBooks] = useState([])
  const [pageSize, setPageSize] = useState(5)
  const [pageNum, setPageNum] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc')
  const [totalNumBooks, setTotalNumBooks] = useState(0)

  useEffect(() => {
    const getBooks = async () => {
      const response = await fetch(
        `http://localhost:5295/Books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`,
      )
      const data = await response.json()
      setBooks(data.books)
      setTotalNumBooks(data.totalNumBooks)
    }

    getBooks()
  }, [pageSize, pageNum, sortOrder])

  const totalPages = Math.ceil(totalNumBooks / pageSize)

  return (
    <div className="container py-4">
      <h1 className="mb-4">Online Bookstore</h1>

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
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.numberOfPages}</td>
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
    </div>
  )
}

export default App
