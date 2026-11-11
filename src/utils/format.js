// Little helpers that turn raw API data into text for the screen.

// 166 -> "2h 46m"
export function formatRuntime(minutes) {
  if (!minutes) return ''
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

// "2023-07-19" -> "2023"
export function getYear(date) {
  return date ? date.slice(0, 4) : ''
}

// 8.4 -> 84 (shown as "84% Match")
export function getMatchPercent(voteAverage) {
  return Math.round((voteAverage || 0) * 10)
}

// Finds the US age rating (PG-13, R, ...) inside the movie details
export function getCertification(details) {
  const us = details?.release_dates?.results?.find((r) => r.iso_3166_1 === 'US')
  const withRating = us?.release_dates.find((d) => d.certification)
  return withRating?.certification || ''
}

// 957800000 -> "$957,800,000"
export function formatMoney(amount) {
  if (!amount) return ''
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// "en" -> "English"
export function languageName(code) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code)
  } catch {
    return code
  }
}
