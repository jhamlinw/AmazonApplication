const API_URL = 'http://localhost:5154/api/Books'

export async function fetchBooks(pageSize, pageNum, sortOrder, categories) {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    pageNum: pageNum.toString(),
    sortOrder,
  })

  if (categories && categories.length > 0) {
    categories.forEach((cat) => params.append('categories', cat))
  }

  const response = await fetch(`${API_URL}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch books')
  return response.json()
}

export async function fetchBook(id) {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Failed to fetch book')
  return response.json()
}

export async function createBook(book) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
  if (!response.ok) throw new Error('Failed to create book')
  return response.json()
}

export async function updateBook(id, book) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
  if (!response.ok) throw new Error('Failed to update book')
}

export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete book')
}
