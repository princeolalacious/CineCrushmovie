# CineCrush 🎬

A modern, high-performance web application for discovering trending cinema, exploring curated reels, and tracking top box office hits with real-time match ratings and detailed movie insights.

---

## 🚀 Key Features

- **Featured Spotlight & Reel Slider:** Interactive featured banner highlighting trending blockbusters with direct access to trailers and detailed specs.
- **Smart Filter & Search:** Real-time search by title or actor, paired with genre and year/rating filters.
- **Top Box Office & Trending Trackers:** Dynamic lists tracking top-voted movies and box office performance.
- **Personalized Favorites:** Seamlessly save and manage your personal watchlist.
- **Pass & Perks System:** Built-in rewards interface for exclusive screening passes.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React (Vite)
- **Styling:** Tailwind CSS / Custom CSS & Material Icons
- **Data Provider:** [TMDB API](https://www.themoviedb.org/)

---

## 🧠 Things Learnt

- **Asynchronous State Management:** Optimized data fetching patterns to deliver instant UI feedback while parsing external API responses.
- **Responsive UX/UI Architecture:** Mastered dark-mode aesthetic design principles, dynamic layout cards, and smooth transitions for media-heavy interfaces.
- **Client-Side Storage:** Implemented persistent user watchlist state across browser sessions.

---

## 🥊 Challenges & Solutions

- **API Data Mapping:**
  - _Challenge:_ Normalizing varied endpoint formats (TMDB genres, ratings, runtime formats).
  - _Solution:_ Created centralized transformer functions to standardize movie data models before state injection.
- **Responsive Reel Navigation:**
  - _Challenge:_ Maintaining smooth transitions and responsive layout across desktop and mobile screens for wide hero sliders.
  - _Solution:_ Leveraged CSS flex container properties and touch/swipe event handlers for consistent carousel control.

---

## ⚙️ Getting Started

```bash
# Clone the repository
git clone https://github.com/princeolalacious/cinecrush.git

# Navigate into project directory
cd cinecrush

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📄 License

project . Distributed under the MIT License.

## ✍️ Author

Designed and Created with ❤️ by princeUduma

Copyright © 2026 CineCrush.
