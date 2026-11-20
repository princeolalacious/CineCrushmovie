import { Link } from "react-router-dom";
import Icon from "./Icon";

// Link lists are kept in arrays so the JSX below stays short.
// Each link is [text, where it goes]. Pages that don't exist yet point to "#".
const exploreLinks = [
  ["Trending Now", "/"],
  ["Advanced Search", "/search"],
  ["Top Rated Movies", "/"],
  ["Theatrical Releases", "/"],
];
const curationLinks = [
  ["Saved Watchlist", "/favorites"],
  ["Genres & Themes", "/"],
  ["Curator Collections", "/"],
  ["Box Office Tracker", "/"],
];
const legalLinks = [
  ["Privacy Policy", "#"],
  ["Terms of Service", "#"],
  ["API Documentation", "https://developer.themoviedb.org/docs"],
];

// Internal links use <Link>, outside links use a normal <a>
function FooterLink({ label, to }) {
  const className = "hover:text-gold";
  if (to.startsWith("http") || to === "#") {
    return (
      <a
        href={to}
        className={className}
        {...(to.startsWith("http")
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
      >
        {label}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
}

function LinkColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-3 text-xs">
      <h4 className="font-bold">{title}</h4>
      <nav className="flex flex-col gap-2 text-muted">
        {links.map(([label, to]) => (
          <FooterLink key={label} label={label} to={to} />
        ))}
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-footer">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full border border-gold/30 bg-surface-3 text-lg text-gold">
                <Icon name="motion_photos_on" />
              </div>
              <p className="text-lg font-bold">
                <span className="text-ink">Cine</span>
                <span className="text-gold">Crush</span>
              </p>
            </div>
            <p className="text-xs text-soft">
              The premier theater-grade platform for discovering award-winning
              cinema, curated reels, and editorial recommendations.
            </p>
          </div>

          <LinkColumn title="Explore" links={exploreLinks} />
          <LinkColumn title="Curation" links={curationLinks} />

          {/* TMDB attribution (TMDB requires this when you use their API) */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold">Data Attribution</h4>
            <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-3">
              <div className="flex items-center gap-2 text-sky">
                <Icon name="database" className="text-xl" />
                <span className="text-xs font-semibold">TMDB Partner</span>
              </div>
              <p className="text-[11px] text-[#e0d6c4]">
                This product uses the TMDB API but is not endorsed or certified
                by TMDB. All movie data and posters are intellectual properties
                of their respective rights holders.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col justify-between gap-4 border-t border-line pt-8 text-xs text-[#e5dccd] md:flex-row">
          <p>
            © 2026 CineHub Cinema / <i>PrinceUduma</i>. All theatrical and
            streaming rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map(([label, to]) => (
              <FooterLink key={label} label={label} to={to} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
