# CineScope

React + Vite + Tailwind CSS v4 + React Router. Movie data from TMDB.

## Run it
1. `npm install`
2. Copy `.env.example` to `.env` and paste your TMDB token (see below)
3. `npm run dev` and open the link it prints (usually http://localhost:5173)

## Get a TMDB token
1. Create a free account at https://www.themoviedb.org/signup
2. Go to Settings > API (https://www.themoviedb.org/settings/api) and request an API key (choose "Developer", personal use)
3. Copy the **API Read Access Token** (the long one, NOT the short "API Key")
4. Put it in `.env`:  VITE_TMDB_TOKEN=your_long_token
5. Restart `npm run dev` after editing `.env`

## Pages (routes)
/                 Home / Discover
/search?q=Avengers Search results (the text and page live in the URL)
/movie/:id        Movie details (?tab=cast | trailers | similar)
/favorites        My Favorites (saved in your browser)

## Folder guide
src/api/tmdb.js            all API calls
src/context/               FavoritesContext (saved movies + toast), GenresContext
src/utils/format.js        small text helpers (runtime, money, year...)
src/pages/                 one file per page
src/components/            Header, Footer, Hero, MovieCard, MovieGrid, Toast, ...
src/components/details/    sections of the Movie Details page
src/index.css              Tailwind + the design colours from Figma
