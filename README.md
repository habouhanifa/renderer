# Component Renderer

A containerised React + Vite app that **auto-detects and indexes JSX components** from a folder, with routing, search, and tag filtering.

Drop a `.jsx` file into `src/components/` — it immediately appears in the gallery with a live preview, its own URL, and syntax-highlighted source view. No configuration required.

---

## Quick start

### Development (hot reload)

```bash
docker compose up dev
```

Open http://localhost:5173. Any `.jsx` file you save to `src/components/` is instantly picked up via Vite HMR.

### Production (optimised Nginx build)

```bash
docker compose up prod --build
```

Open http://localhost:8080.

---

## Adding a new component

1. Create a file in `src/components/`, e.g. `src/components/MyWidget.jsx`
2. Export a default React component
3. That's it — refresh and it appears in the gallery

```jsx
// src/components/MyWidget.jsx

export default function MyWidget() {
  return <div>Hello from MyWidget!</div>
}
```

The filename is converted to a human-readable title automatically:
`MyWidget.jsx` → **"My Widget"**, route: `/components/MyWidget`

---

## Adding tags (optional)

Export a `meta` object with a `tags` array. Tags appear on each card and as filter buttons on the index page.

```jsx
// src/components/MyWidget.jsx

export const meta = {
  tags: ["ui", "form"],
}

export default function MyWidget() {
  return <div>Hello from MyWidget!</div>
}
```

---

## Project structure

```
src/
├── components/            ← drop .jsx files here
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Example.jsx
│   └── InputField.jsx
├── pages/
│   ├── Index.jsx          ← gallery with search + tag filter
│   └── ComponentPage.jsx  ← standalone view + source code
├── componentRegistry.js   ← Vite glob-based auto-discovery
├── App.jsx                ← React Router setup
├── main.jsx               ← entry point
└── index.css              ← Tailwind directives
```

---

## How auto-detection works

`src/componentRegistry.js` uses two Vite glob imports:

```js
// Lazy module (default export + optional meta)
const moduleGlobs = import.meta.glob('./components/*.jsx')

// Raw source string for the code viewer
const sourceGlobs = import.meta.glob('./components/*.jsx', { as: 'raw' })
```

Vite resolves both globs at build time and sets up dynamic imports for every matching file. Adding a file triggers an HMR update in dev, and a new static entry at build time in prod.

---

## Styling

- **Tailwind CSS v3** — utility-first, dark-mode-ready
- **highlight.js** (via CDN) — syntax highlighting on the component source page
- Responsive grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)

---

## Docker details

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| `dev`   | `docker compose up dev` | 5173 | Vite dev server, `src/` volume-mounted |
| `prod`  | `docker compose up prod --build` | 8080 | Multi-stage build → Nginx |

The production Dockerfile uses a **Node 20 Alpine** build stage and an **Nginx Alpine** serve stage, keeping the final image small (~25 MB).

---

## Component file convention

```jsx
// optional — adds tags to the gallery filter
export const meta = {
  tags: ["category", "another-tag"],
}

// required — the component that gets rendered
export default function ComponentName() {
  return <div>your component here</div>
}
```
