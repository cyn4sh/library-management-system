import { useEffect, useState } from 'react'
import BookCard from './BookCard.jsx'

const API_URL = import.meta.env.VITE_API_URL
const GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4'

function SkeletonCard() {
  return (
    <div className="animate-shimmer overflow-hidden rounded-xl border border-line bg-card">
      <div className="aspect-[3/4] bg-paper-deep" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 rounded bg-paper-deep" />
        <div className="h-3 w-1/3 rounded bg-paper-deep" />
      </div>
    </div>
  )
}

export default function BookGrid({ genreId, search }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Cleanup flips this to true, so a slow, outdated response
    // can never overwrite a newer one.
    let ignore = false

    async function loadBooks() {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({ limit: '100' })
      if (genreId) params.set('genreId', genreId)
      if (search) params.set('search', search)

      try {
        const response = await fetch(`${API_URL}/books?${params}`)
        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}`)
        }
        const json = await response.json()
        if (!ignore) setBooks(json.data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBooks()
    return () => {
      ignore = true
    }
  }, [genreId, search])

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-brick/30 bg-card px-6 py-12 text-center"
      >
        <h2 className="font-display text-xl font-semibold text-brick">
          We couldn&apos;t load the catalog
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {error}. Check that the API is running, then refresh the page.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={GRID} aria-busy="true">
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
        <h2 className="font-display text-xl font-semibold">No books found</h2>
        <p className="mt-2 text-sm text-ink-soft">
          {search
            ? `Nothing matches "${search}". Try a different title or author.`
            : 'There are no books in this section yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className={GRID}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}