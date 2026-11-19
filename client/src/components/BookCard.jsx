import { Link } from 'react-router-dom'

// Full class names only: Tailwind finds classes by scanning for complete
// strings, so we can't build them like `bg-${color}`.
const COVER_STYLES = {
  Fiction: 'bg-[#6e3b47] text-[#f6e9e6]',
  Science: 'bg-[#2f4a5e] text-[#e6eef3]',
  History: 'bg-[#7a5c2e] text-[#f5ecd9]',
  Technology: 'bg-[#2f5d4a] text-[#e3ede6]',
}
const FALLBACK_COVER = 'bg-ink-soft text-paper'

export default function BookCard({ book }) {
  const cover = COVER_STYLES[book.genre.name] ?? FALLBACK_COVER

  return (
    <Link
      to={`/books/${book.id}`}
      className="group block overflow-hidden rounded-xl border border-line bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
    >
      <div className={`flex aspect-[3/4] flex-col justify-between p-5 ${cover}`}>
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] opacity-80">
          {book.genre.name}
        </span>
        <h3 className="font-display text-2xl font-semibold leading-tight">
          {book.title}
        </h3>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-ink">{book.author}</p>
        <p className="mt-1 text-xs text-ink-soft">{book.publicationYear}</p>
      </div>
    </Link>
  )
}