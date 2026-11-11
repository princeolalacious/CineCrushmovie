import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GenresProvider } from './context/GenresContext'
import { FavoritesProvider } from './context/FavoritesContext'

// The providers make genres + favorites available to every component.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GenresProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </GenresProvider>
    </BrowserRouter>
  </StrictMode>,
)
