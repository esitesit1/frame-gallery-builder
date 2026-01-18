import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Frame Gallery
        </Link>
        {location.pathname !== '/' ? (
          <Link
            to="/"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Ana Sayfa
          </Link>
        ) : null}
      </div>
    </header>
  )
}
