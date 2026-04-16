const API_URL = 'http://localhost:5295/Books'

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

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}
