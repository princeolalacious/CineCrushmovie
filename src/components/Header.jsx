import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  // Go to /search?q=... when the form is submitted (Enter key or button)
  function handleSubmit(event) {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;
    navigate(`/search?q=${encodeURIComponent(text)}`);
  }

  // NavLink gives us "isActive" so we can highlight the current page.
  const navClass = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm ${
      isActive
        ? "bg-gold/15 font-bold text-gold"
        : "font-medium text-muted hover:bg-surface-2 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-gold/30 bg-surface-3 text-[22px] text-gold">
            <Icon name="motion_photos_on" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight">
              <span className="text-ink">Cine</span>
              <span className="text-gold">Hub</span>
            </p>
            <p className="hidden text-[10px] font-medium text-muted lg:block">
              Discover movies. Watch. Save.
            </p>
          </div>
        </Link>

        {/* Page links (icons only on small screens) */}
        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            <Icon name="home" className="text-xl" />
            <span className="hidden md:inline">Home</span>
          </NavLink>
          <NavLink to="/favorites" className={navClass}>
            <Icon name="favorite" className="text-xl" />
            <span className="hidden md:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="rounded-full bg-gold px-1.5 text-[10px] font-extrabold text-gold-dark">
                {favorites.length}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {/* Search box (bigger screens) */}
          <form
            onSubmit={handleSubmit}
            role="search"
            className="hidden sm:block"
          >
            <label className="flex h-11 w-52 items-center gap-2 rounded-xl bg-surface px-4 text-muted lg:w-72">
              <Icon name="search" className="text-xl" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, actors..."
                aria-label="Search movies"
                className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted"
              />
            </label>
          </form>

          {/* Search icon (small screens) goes to the search page */}
          <Link
            to="/search"
            aria-label="Search"
            className="flex size-10 items-center justify-center rounded-xl bg-surface text-xl text-muted sm:hidden"
          >
            <Icon name="search" />
          </Link>

          <button
            aria-label="Notifications"
            className="relative hidden size-10 items-center justify-center rounded-xl border border-line bg-surface text-xl text-muted hover:text-gold sm:flex"
          >
            <Icon name="notifications" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-gold" />
          </button>

          <div className="hidden size-8 items-center justify-center rounded-full bg-[#ffe6b3] text-lg text-[#3f2e00] sm:flex">
            <Icon name="person" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
