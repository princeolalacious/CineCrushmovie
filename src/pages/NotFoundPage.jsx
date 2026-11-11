import { Link } from 'react-router-dom'

// Shown for any address that doesn't exist, e.g. /banana
function NotFoundPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-6xl font-extrabold text-gold">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-sm text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-gold-dark hover:bg-gold-hover">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFoundPage
