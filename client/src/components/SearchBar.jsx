import { useEffect, useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(text)
    }, 400)

    // Cleanup: runs before the next effect, so each new keystroke
    // cancels the previous timer and restarts the wait.
    return () => clearTimeout(timer)
  }, [text, onSearch])

  return (
    <div className="relative">
      <label htmlFor="catalog-search" className="sr-only">
        Search books by title or author
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <input
        id="catalog-search"
        type="search"
        placeholder="Search by title or author"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-full rounded-full border border-line bg-card py-3 pl-12 pr-5 text-sm text-ink shadow-card outline-none transition placeholder:text-ink-soft/70 focus:border-forest focus:ring-2 focus:ring-forest/25"
      />
    </div>
  )
}