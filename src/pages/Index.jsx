import React, { useState, useEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { getComponentDescriptors, loadComponentBySlug } from '../componentRegistry.js'

/**
 * A single component card.
 * Lazy-loads the component module to render a live preview and read its meta tags.
 */
function ComponentCard({ descriptor }) {
  const [mod, setMod] = useState(null)
  const [previewError, setPreviewError] = useState(false)

  useEffect(() => {
    loadComponentBySlug(descriptor.slug)
      .then(setMod)
      .catch(() => setPreviewError(true))
  }, [descriptor.slug])

  const tags = mod?.meta?.tags ?? []

  return (
    <div className="flex flex-col rounded-xl border border-gray-700 bg-gray-900 overflow-hidden shadow-lg hover:border-indigo-500 transition-colors">
      {/* Live preview area */}
      <div className="flex-1 bg-gray-800 p-4 min-h-[140px] flex items-center justify-center overflow-hidden">
        {previewError ? (
          <span className="text-gray-500 text-sm italic">Preview unavailable</span>
        ) : mod ? (
          <PreviewSandbox Component={mod.Component} />
        ) : (
          <span className="text-gray-600 text-sm animate-pulse">Loading…</span>
        )}
      </div>

      {/* Card footer */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-100 leading-snug">
            {descriptor.name}
          </h2>
          <Link
            to={`/components/${descriptor.slug}`}
            className="shrink-0 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md transition-colors"
          >
            View
          </Link>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 font-mono">{descriptor.filename}</p>
      </div>
    </div>
  )
}

/**
 * Renders a component in an isolated error boundary so a broken component
 * doesn't crash the whole index page.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <span className="text-red-400 text-xs italic">Render error</span>
      )
    }
    return this.props.children
  }
}

function PreviewSandbox({ Component }) {
  return (
    <ErrorBoundary>
      <div className="preview-sandbox w-full">
        <Component />
      </div>
    </ErrorBoundary>
  )
}

export default function Index() {
  const descriptors = getComponentDescriptors()

  // Build tag list from all loaded modules
  const [allTags, setAllTags] = useState([])
  const [tagMap, setTagMap] = useState({}) // slug → tags[]

  useEffect(() => {
    const tagSet = new Set()
    const map = {}

    Promise.all(
      descriptors.map((d) =>
        loadComponentBySlug(d.slug).then((mod) => {
          const tags = mod?.meta?.tags ?? []
          map[d.slug] = tags
          tags.forEach((t) => tagSet.add(t))
        })
      )
    ).then(() => {
      setTagMap({ ...map })
      setAllTags([...tagSet].sort())
    })
  }, [])

  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)

  const filtered = descriptors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesTag =
      !activeTag || (tagMap[d.slug] ?? []).includes(activeTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Component Library
        </h1>
        <p className="text-gray-400 text-sm">
          {descriptors.length} component{descriptors.length !== 1 ? 's' : ''} detected in{' '}
          <code className="text-indigo-400 font-mono">src/components/</code>
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <input
          type="search"
          placeholder="Search components…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeTag === null
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeTag === tag
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm py-12 text-center">
          No components match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <ComponentCard key={d.slug} descriptor={d} />
          ))}
        </div>
      )}
    </div>
  )
}
