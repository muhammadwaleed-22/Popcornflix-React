# Popcornflix — Project Documentation

> Generated: 2026-02-01 (expanded)

---

## Overview ✨

**Popcornflix** is a small yet feature-complete React application built with Vite, Tailwind CSS, and `@heroui/react` primitives. It consumes the YTS API to provide movie browsing, searching/filtering, categorical rows, and detailed movie pages (including similar movie recommendations). The project is structured for clarity and reuse: API concerns live in `src/api`, data fetching and hooks in `src/Hooks`, UI building blocks in `src/Components`, and route-level pages in `src/Pages`.

Key features:
- Browsing with pagination and advanced filters
- Top / New releases pages
- Navbar live-search and Hero (page) search form
- Detailed movie pages with similar movies
- Reusable carousels and rows for genre-specific sections

---

## Architecture & Data Flow 🔧

The app follows a client-driven data-fetch pattern with small, focused hooks driving data fetching and state for components. The UI is composed of small, stateless presentational components (e.g., `Card`, `MovieRow`) and stateful page hooks (e.g., `useMovies`, `useFilteredMovies`). The API layer centralizes endpoint construction and shared helpers.

Highlights:
- `src/api/*` — central API constants and helpers (URLs, similar-movie algorithm)
- `src/Hooks/*` — encapsulated fetch logic (returned states: `loading`, `error`, `movies`, `totalPages`)
- `src/Components/*` — pure UI components that accept movie data and callbacks
- `src/Pages/*` — orchestrate multiple components and hooks to render views

---

## Workflow Diagram (Mermaid + ASCII fallback) 🧭

### Mermaid (preferred if your Markdown renderer supports it)

```mermaid
flowchart LR
  Browser[Browser UI]
  Browser -->|navigate| Router[React Router]
  Router --> Home[Home Page]
  Router --> Browse[Browse Page]
  Router --> Detail[Detail Page]
  Browse --> Hero[Hero (Filter Form)]
  Hero -->|form submit| useFilteredMovies[useFilteredMovies Hook]
  Browse -->|on mount| useMovies[useMovies Hook]
  Home -->|rows| MovieRow[MovieRow / MovieCarousel]
  MovieRow -->|calls| useMovies
  Card -->|click| RouterDetail[go to /detail/:id]
  Detail -->|fetch| movieDetailsAPI[GET movie_details.json]
  Detail -->|fetch| getSimilarMovies(getSimilarMovies helper)

  subgraph API
    movieListAPI[list_movies.json]
    movieDetailsAPI
    movieListAPI -->|data| useMovies
    movieListAPI -->|data| getSimilarMovies
  end
```

### ASCII fallback

Browser → Router → {Home, Browse, Detail}
Browse → Hero → useFilteredMovies → list_movies.json
Browse → useMovies → list_movies.json
Home → MovieRow/MovieCarousel → useMovies → list_movies.json
Card click → navigate to Detail → get movie_details.json → show movie, call getSimilarMovies → list_movies.json (exclude current)

---

## Component & Hook Interaction (quick)

- `Navbar` exposes a search box and uses `useNavbarSearch` to query `list_movies.json?query_term=`; results are shown in a dropdown using `Card`.
- `Browse` mounts `Hero` and the main grid; `Hero` uses `useFilteredMovies` to apply filters and return matching `movies`.
- `MovieRow`/`MovieCarousel` use `useMovies` for genre/type-specific lists; these components are presentational and accept `movies[]` and handlers.
- `Detail` uses `movie_details.json` for the primary movie metadata and falls back to a `list_movies.json` fetch + filter to produce similar titles.

---

## File-by-file: Behavior paragraphs 📄

Below are detailed, code-level explanations describing **how each file works at runtime** (inputs, outputs, side effects, key lines, and example shapes). Files are grouped by folder for readability. Each entry contains: a short purpose, key exports/signature, step-by-step runtime behavior, important lines or patterns to look for, and a small pseudo-code example or expected data shape.

### Top-level

- `src/App.jsx`
  - Purpose: Router and global shell.
  - Key exports / signature: default `App()` React component.
  - Runtime behavior:
    1. Imports `BrowserRouter` / `Routes` / `Route` from `react-router-dom` and page components.
    2. Renders `<Navbar />` once and a `<Routes>` block that maps paths to pages.
    3. Passes down URL params via `useParams` inside pages like `Detail`.
  - Important lines:
    - Route definitions — verify paths match `<Link>` usages (e.g., `/detail/:id`).
    - Any top-level context providers or error boundaries should be registered here.
  - Example (pseudo):
    - <App> -> <Navbar />, <Routes>
    - Route path="/" element={<Browse />} etc.

- `src/main.jsx`
  - Purpose: Create and mount React root and set up global providers.
  - Key exports: boots the app (no direct exports).
  - Runtime behavior:
    1. Imports `createRoot` and wraps `<App />` in `HeroUIProvider` and `React.StrictMode`.
    2. Calls `createRoot(document.getElementById('root')).render(...)`.
  - Important lines:
    - `HeroUIProvider` wrap — this provides theme and components from `@heroui/react` to children and may inject global CSS or contexts.

- `src/index.css` & `src/hero.js`
  - Purpose: Global CSS utilities and UI toolkit configuration.
  - Runtime behavior:
    - `index.css` imports Tailwind directives and sets base styles; any global CSS overrides or custom utilities appear here.
    - `hero.js` configures and exports theme variables used by components in the app.
  - Important lines: Tailwind `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` and any project-specific classes.

---

### API layer

- `src/api/config.api.js`
  - Purpose: centralize base URL and related constants.
  - Key exports: `BASE_URL` (string), maybe a helper `apiPath` function.
  - Runtime behavior & notes:
    - Changing `BASE_URL` swaps the source for all requests (handy for mocking or switching endpoints).

- `src/api/movieService.js`
  - Purpose: Create endpoint templates and helper functions like `getSimilarMovies`.
  - Key exports: `MOVIE_API` object and `getSimilarMovies(movieId, genres, limit)` function.
  - Runtime behavior (step-by-step):
    1. `MOVIE_API` contains prebuilt URLs or templates, for example:
       - `BROWSE_DATA = `${BASE_URL}/list_movies.json?limit=24&page=${page}``
       - `TOP_DATA = `${BASE_URL}/list_movies.json?sort_by=like_count``
    2. `getSimilarMovies(movieId, genres, limit)`:
       - Calls `list_movies.json` to fetch a broad set of movies.
       - Filters out the movie with `id === movieId`.
       - If `genres` provided, compute intersection and prefer movies with shared genres.
       - If insufficient matches, fall back to a simple slice of the list.
       - Returns an array (never `null`). Catches errors and returns `[]`.
  - Important lines / patterns:
    - Defensive checks after the fetch: ensure `response?.data?.movies` exists.
    - Sorting logic when matching genres: ensure deterministic results (e.g., stable sort by number of matched genres + rating).
  - Example return shape:
    - `[{ id: 123, title: 'Example', genres: ['Drama'], rating: 7.5, ... }, ...]`

---

### Hooks

- `src/Hooks/hook.jsx` (contains `useMovies` + `useSimilarMovies`)
  - Purpose: encapsulate data fetching for lists and similar movies.
  - Key exports / signatures:
    - `useMovies({ type = 'BROWSE', page = 1, params = {}, genre }) => { movies, loading, error, totalPages }`
    - `useSimilarMovies({ movieId, genres, limit = 4 }) => { similar, loading, error }`
  - Runtime behavior (useMovies):
    1. Build the URL: if `type === 'BROWSE'` use `MOVIE_API.BROWSE_DATA`, append `page` and `params` as `URLSearchParams`.
    2. Call `fetch(url)` and set `loading = true` before the call.
    3. On success: set `movies` from `res.data.movies` (or `[]`) and compute `totalPages` if `res.data.movie_count` exists.
    4. Manage errors by setting `error` and ensuring `loading = false` in finally.
  - Important lines / patterns:
    - `useEffect` dependencies: include `page`, `type`, and JSON-stringified `params` to re-run correctly.
    - Cancelation: if there is potential for stale responses, use an `AbortController` or a mounted flag to ignore late responses.
  - Example usage:
    - const { movies, loading, error, totalPages } = useMovies({ type: 'BROWSE', page: 2 });

- `src/Hooks/useNavbarSearch.js`
  - Signature: `useNavbarSearch()` returns `{query, setQuery, results, loading, error}`.
  - Runtime behavior:
    - Optional debounce (e.g., 300ms) before firing `fetch(list_movies.json?query_term=${query})`.
    - Clears results when `query` becomes empty; sets `loading` and `error` appropriately.
  - Important lines:
    - Debounce implementation (either `setTimeout` in `useEffect` or a useDebouncedValue helper).
    - Ensuring keyboard accessibility: the hook may provide methods for `select(index)`.

- `src/Hooks/useFilteredMovies.js`
  - Signature: `useFilteredMovies(searchParams) => { movies, loading, error }`
  - Runtime behavior:
    - Accepts a `searchParams` object, converts it to `URLSearchParams`.
    - Calls `list_movies.json` with those params and maps the response to `movies`.
    - Returns `[]` when `searchParams` empty or no results.
  - Important lines:
    - Normalization: the hook should ensure the response shape is consistent even when YTS returns `null` or `undefined`.

---

### Pages (runtime + code notes)

- `src/Pages/Browse.jsx`
  - Purpose: browsing UI and filters.
  - Runtime behavior:
    1. Maintains `page` state and either reads `searchParams` from `Hero` or uses `useMovies` for default browse.
    2. On `Hero` submit, update a local `filters` state which is passed into `useFilteredMovies`.
    3. Maps `movies` to `<Card />` components and displays `Paggination` using `totalPages`.
  - Important lines:
    - `useEffect` that syncs query string to the URL (optional) for shareable links.
    - `onChange` handler for `Paggination` that updates the `page` state.
  - Example interaction:
    - Hero submits { genre: 'Animation', rating: '7+', order_by: 'year' } → call useFilteredMovies → update movie grid.

- `src/Pages/Home.jsx`
  - Purpose: showcase rows of genre-specific content.
  - Runtime behavior:
    - Renders `NewRelease`, `ScienceFiction`, `Romantic`, etc. Each child fetches its own data via `useMovies`.
    - Typically lazy-loads rows or uses intersection observer to defer offscreen fetches for performance.
  - Important lines: ensure each row uses a unique key and has `aria` labels for accessibility.

- `src/Pages/New.jsx` and `src/Pages/Top.jsx`
  - Purpose: list pages that use `useMovies({ type: 'NEW' })` / `useMovies({ type: 'TOP' })`.
  - Runtime: Similar to `Browse` but simplified: fetch once, render grid, and show `FooterData`.

- `src/Pages/Detail.jsx`
  - Purpose: movie details view.
  - Runtime behavior:
    1. Uses `useParams()` to get `:id`.
    2. Fetches `movie_details.json?movie_id=${id}` and sets `movie` state.
    3. Calls `getSimilarMovies(id, movie.genres, 4)` to populate similar titles.
    4. Renders all available fields: `title`, `description_full`, `year`, `runtime`, `genres`, `rating`, `download_count`, `images`.
  - Important lines / edge cases:
    - Check for `movie.images` existence before rendering images.
    - Gracefully handle `movie.genres` being `null`.
  - Example data shape from details endpoint:
    - `movie: { id, title, year, rating, runtime, genres: ['Action', 'Drama'], description_full, images: { medium_cover_image } }

---

### Components (props, behaviors, and code notes)

- `src/Components/Card.jsx`
  - Purpose: single-movie presentation.
  - Props: `movie` (object), `onClick` (navigate callback), optional `size` / `showMeta`.
  - Runtime behavior:
    - Displays image with `<img src={movie.medium_cover_image} />`.
    - On `hover`, shows overlay with `rating` and `genres`.
    - `View Details` button triggers navigation to `/detail/${movie.id}`.
  - Important lines:
    - Defensive rendering: `movie?.rating ?? 'N/A'`.
    - Use `alt` attributes for images and `loading='lazy'` for performance.

- `src/Components/MovieRow.jsx`
  - Purpose: horizontally laid-out list with title + items.
  - Props: `title`, `movies`, `onItemClick`.
  - Runtime behavior:
    - If `movies` is empty, render a friendly placeholder.
    - Map `movies` to `Card` components; provide left/right controls if row is scrollable.

- `src/Components/MovieCarousel.jsx`
  - Purpose: add paging/scrolling controls to a `MovieRow`.
  - Important behaviors:
    - Holds `index` or `page` local state to show subsets of the list.
    - Handles `prev` / `next` click handlers; disables buttons at bounds.
    - Optionally supports autoplay (not typically used here).

- Genre components (`NewRelease.jsx`, `ScienceFiction.jsx`, `Romantic.jsx`, `Kids.jsx`, `Family.jsx`, `Dramas.jsx`)
  - Purpose: thin adapters that call `useMovies({ type: 'GENRE', genre: '...' })` and render `MovieCarousel`.
  - Important note: genre strings must match YTS genres exactly.

- `src/Components/Hero.jsx`
  - Purpose: filter & search form used on the Browse page.
  - Props: `onSubmit(filters)` or it may internally call `useFilteredMovies`.
  - Runtime behavior:
    1. Renders `<form>` with select/inputs for `quality`, `genre`, `rating`, `year`, `language`, `order_by`.
    2. On submit, builds `filters` object and calls parent handler.
    3. Shows `loading` and `no results` when appropriate.
  - Important lines:
    - Normalization of the `rating` value to ensure it's a number (e.g., 7 => `rating=7`).

- `src/Components/Navbar.jsx`
  - Purpose: global header and search.
  - Runtime behavior:
    - Uses `useNavbarSearch` hook to perform API calls as user types.
    - Renders a dropdown of `results` using `Card` components (keyboard navigable).
  - Important lines:
    - Manage focus and dropdown visibility; close dropdown on outside clicks.

- `src/Components/Paggination.jsx`
  - Purpose: small pagination control.
  - Props: `page`, `totalPages`, `onChange(newPage)`.
  - Important lines:
    - Ensure `onChange` clamps incoming values to `[1, totalPages]`.

- `src/Components/FooterData.jsx`
  - Purpose: page footer with copyright and small links.

---

## Notes about testing and change points

- To add unit tests, focus on `useMovies` and `useFilteredMovies` — mock fetch and assert states (`loading` -> `movies` -> `error`).
- For `Detail.jsx`, mock the `movie_details.json` payload and ensure your `getSimilarMovies` stub returns a predictable list.
- Critical files that break UI when changed: `movieService.js` (API URLs), `Hooks/hook.jsx` (fetch logic), and `Components/Card.jsx` (layout for many pages).

---

## Debugging and Developer Tips ⚠️

---

## Debugging and Developer Tips ⚠️

- Open the console to inspect fetch URLs — `useMovies` logs constructed URLs for each fetch. This helps diagnose `genre` or param typos.
- YTS is strict about `genre` and `quality` values: use exact-case strings like `Animation`, `Drama`, `Romance`, `Sci-Fi`.
- To avoid duplicated movies across multiple carousels, deduplicate by `id` at composition time (e.g., `Home.jsx` can keep a Set of included IDs).
- Add caching or memoization for repeated list requests to reduce network traffic (e.g., react-query or a simple fetch cache layer).

---

## How to produce a PDF from this file ✅

1. Install `md-to-pdf` (optional):
   - `npm i -D md-to-pdf`
2. Then run:
   - `npx md-to-pdf Popcornflix_DOCUMENTATION.md -o Popcornflix_DOCUMENTATION.pdf`

I can also generate the PDF for you in the workspace if you'd like (tell me PDF or DOCX and I'll create it).

---

## Next steps & offers 💡

- Want a visual PNG or SVG export of the Workflow Diagram? I can create and add it to `public/images/`.
- Want the PDF generated now? Reply `pdf` and I'll add `Popcornflix_DOCUMENTATION.pdf` to the repo.
- Want tests or TypeScript types added to the hooks? I can scaffold them.

---

# End — Popcornflix Documentation

If you want any section expanded into developer checklists or code examples (e.g., how to add caching, debounce search, or unit tests for hooks), say which section and I'll add it next. 

