import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

const COVER_STYLES = {
  Fiction: 'bg-[#6e3b47] text-[#f6e9e6]',
  Science: 'bg-[#2f4a5e] text-[#e6eef3]',
  History: 'bg-[#7a5c2e] text-[#f5ecd9]',
  Technology: 'bg-[#2f5d4a] text-[#e3ede6]',
}
const FALLBACK_COVER = 'bg-ink-soft text-paper'

const BACK_LINK =
  'inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep'

export default function BookDetail() {
  const { id } = useParams()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Cleanup flips this to true, so a slow, outdated response
    // can never overwrite a newer one.
    let ignore = false

    async function loadBook() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/books/${id}`)
        if (response.status === 404) {
          throw new Error('Book not found')
        }
        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}`)
        }
        const json = await response.json()
        if (!ignore) setBook(json)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBook()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-12" aria-busy="true">
        <div className="grid animate-shimmer gap-8 md:grid-cols-[320px_1fr]">
          <div className="aspect-[3/4] rounded-xl bg-paper-deep" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-24 rounded bg-paper-deep" />
            <div className="h-10 w-3/4 rounded bg-paper-deep" />
            <div className="h-4 w-1/3 rounded bg-paper-deep" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-semibold text-brick">{error}</h1>
        <p className="mt-3 text-ink-soft">
          The book may have been removed, or the link may be wrong.
        </p>
        <Link to="/" className={`${BACK_LINK} mt-8`}>
          &larr; Back to the catalog
        </Link>
      </main>
    )
  }

  const cover = COVER_STYLES[book.genre.name] ?? FALLBACK_COVER

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">
      <Link to="/" className={BACK_LINK}>
        &larr; Back to the catalog
      </Link>

      <article className="mt-8 grid gap-10 md:grid-cols-[320px_1fr]">
        <div
          className={`flex aspect-[3/4] flex-col justify-between rounded-xl p-6 shadow-lift ${cover}`}
        >
          <span className="text-xs font-medium uppercase tracking-[0.18em] opacity-80">
            {book.genre.name}
          </span>
          <p className="font-display text-3xl font-semibold leading-tight">
            {book.title}
          </p>
        </div>

        <div className="pt-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-forest">
            {book.genre.name}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-ink-soft">by {book.author}</p>

          <dl className="mt-10 grid max-w-md grid-cols-2 gap-y-5 border-t border-line pt-8 text-sm">
            <dt className="text-ink-soft">Published</dt>
            <dd className="font-medium">{book.publicationYear}</dd>
            <dt className="text-ink-soft">ISBN</dt>
            <dd className="font-medium">{book.isbn}</dd>
            <dt className="text-ink-soft">Copies in the library</dt>
            <dd className="font-medium">{book.totalCopies}</dd>
          </dl>
        </div>
      </article>
    </main>
  )
}