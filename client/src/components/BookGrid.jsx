import { useState } from 'react'

export default function BookGrid({ genreId, search }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return null
}