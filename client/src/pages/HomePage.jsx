import { useEffect, useState } from 'react'
import BookGrid from '../components/BookGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'

const API_URL = import.meta.env.VITE_API_URL

function pillClass(active) {
  return `rounded-full border px-4 py-1.5 text-sm font-medium transition ${
    active
      ? 'border-forest bg-forest text-paper'
      : 'border-line bg-card text-ink-soft hover:border-forest hover:text-forest'
  }`
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [genreId, setGenreId] = useState(null)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    let ignore = false

    async function loadGenres() {
      try {
        const response = await fetch(`${API_URL}/genres`)
        if (!response.ok) return
        const json = await response.json()
        if (!ignore) setGenres(json)
      } catch {
        // BookGrid shows its own error, so the filter just stays on "All".
      }
    }

    loadGenres()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-forest">
          The Reading Room
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
          Find your next read
        </h1>
        <p className="mt-3 text-ink-soft">
          Browse the catalog by genre, or search by title or author.
        </p>
      </header>

      <div className="mb-8 space-y-5">
        <SearchBar onSearch={setSearch} />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
          <button
            type="button"
            aria-pressed={genreId === null}
            onClick={() => setGenreId(null)}
            className={pillClass(genreId === null)}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              aria-pressed={genreId === genre.id}
              onClick={() => setGenreId(genre.id)}
              className={pillClass(genreId === genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <BookGrid genreId={genreId} search={search} />
    </main>
  )
}