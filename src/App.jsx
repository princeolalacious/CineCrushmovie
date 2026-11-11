import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'

// Scrolls back to the top whenever you go to another page.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />

      {/* Only this part changes when the address changes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <Toast />
    </div>
  )
}

export default App
