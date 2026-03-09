import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fileNameToTitle, loadComponentBySlug } from '../componentRegistry.js'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="m-8 rounded-lg border border-red-700 bg-red-950 p-4 text-sm text-red-300">
          <strong>Render error:</strong> {this.state.error?.message}
        </div>
      )
    }
    return this.props.children
  }
}

export default function ComponentPage() {
  const { slug } = useParams()
  const [mod, setMod] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const codeRef = useRef(null)

  useEffect(() => {
    setMod(null)
    setNotFound(false)
    loadComponentBySlug(slug).then((result) => {
      if (!result) setNotFound(true)
      else setMod(result)
    })
  }, [slug])

  // Re-run highlight.js whenever source becomes available
  useEffect(() => {
    if (mod?.source && codeRef.current && window.hljs) {
      delete codeRef.current.dataset.highlighted
      window.hljs.highlightElement(codeRef.current)
    }
  }, [mod?.source])

  const name = fileNameToTitle(`${slug}.jsx`)

  if (notFound) {
    return (
      <div className="p-8 space-y-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
          ← Back to index
        </Link>
        <p className="text-red-400">
          Component <code className="font-mono">{slug}.jsx</code> not found in{' '}
          <code className="font-mono">src/components/</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
        >
          ← Back
        </Link>

        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base font-semibold text-white truncate">{name}</h1>
          <span className="text-xs font-mono text-gray-500 truncate hidden sm:block">
            {slug}.jsx
          </span>
        </div>

        {mod?.meta?.tags && mod.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 ml-auto">
            {mod.meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Full-page component render ───────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-8">
        {mod ? (
          <ErrorBoundary>
            <div className="w-full">
              <mod.Component />
            </div>
          </ErrorBoundary>
        ) : (
          <span className="text-gray-600 text-sm animate-pulse">Loading…</span>
        )}
      </main>

      {/* ── Collapsible source code ──────────────────────────────────────── */}
      <details className="border-t border-gray-800 group">
        <summary className="flex items-center gap-2 px-6 py-3 cursor-pointer select-none text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-900 transition-colors list-none">
          {/* chevron rotates when open */}
          <svg
            className="w-4 h-4 transition-transform group-open:rotate-90 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium">Source</span>
          <span className="ml-auto font-mono text-xs text-gray-600">{slug}.jsx</span>
        </summary>

        <div className="px-4 pb-4">
          {mod ? (
            <pre className="rounded-xl overflow-auto text-sm">
              <code ref={codeRef} className="language-javascript">
                {mod.source}
              </code>
            </pre>
          ) : (
            <div className="rounded-xl bg-gray-900 border border-gray-700 p-6 text-gray-600 text-sm animate-pulse">
              Loading source…
            </div>
          )}
        </div>
      </details>
    </div>
  )
}
