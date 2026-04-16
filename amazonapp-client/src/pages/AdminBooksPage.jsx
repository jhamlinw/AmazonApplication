import { useEffect, useState } from 'react'
import { fetchBooks, createBook, updateBook, deleteBook } from '../api'

const emptyBook = {
  bookID: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
}

function AdminBooksPage() {
  const [books, setBooks] = useState([])
  const [totalNumBooks, setTotalNumBooks] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(true)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({ ...emptyBook })
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const loadBooks = () => {
    setLoading(true)
    fetchBooks(pageSize, pageNum, 'asc')
      .then((data) => {
        setBooks(data.books)
        setTotalNumBooks(data.totalNumBooks)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBooks()
  }, [pageSize, pageNum])

  const totalPages = Math.ceil(totalNumBooks / pageSize)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pageCount'
          ? parseInt(value) || 0
          : name === 'price'
            ? parseFloat(value) || 0
            : value,
    }))
  }

  const handleAddNew = () => {
    setEditingBook(null)
    setFormData({ ...emptyBook })
    setShowForm(true)
    setError('')
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({ ...book })
    setShowForm(true)
    setError('')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBook(null)
    setFormData({ ...emptyBook })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.isbn.trim()
    ) {
      setError('Title, Author, and ISBN are required.')
      return
    }

    try {
      if (editingBook) {
        await updateBook(formData.bookID, formData)
      } else {
        await createBook(formData)
      }
      setShowForm(false)
      setEditingBook(null)
      setFormData({ ...emptyBook })
      loadBooks()
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return

    try {
      await deleteBook(id)
      loadBooks()
    } catch {
      setError('Failed to delete book.')
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin &mdash; Manage Books</h1>
        {!showForm && (
          <button className="btn btn-success" onClick={handleAddNew}>
            + Add Book
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Author *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Publisher</label>
                  <input
                    type="text"
                    className="form-control"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">ISBN *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Classification</label>
                  <input
                    type="text"
                    className="form-control"
                    name="classification"
                    value={formData.classification}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Page Count</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <th style={{ width: '150px' }}>Actions</th>
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
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(book.bookID)}
                      >
                        Delete
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
    </>
  )
}

export default AdminBooksPage
