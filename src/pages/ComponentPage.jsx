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
        <div className="rounded-lg border border-red-700 bg-red-950 p-4 text-sm text-red-300">
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
      if (!result) {
        setNotFound(true)
      } else {
        setMod(result)
      }
    })
  }, [slug])

  // Re-run highlight.js whenever source code becomes available
  useEffect(() => {
    if (mod?.source && codeRef.current && window.hljs) {
      // Remove previous highlighting so hljs re-processes the block
      delete codeRef.current.dataset.highlighted
      window.hljs.highlightElement(codeRef.current)
    }
  }, [mod?.source])

  const name = fileNameToTitle(`${slug}.jsx`)

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
        >
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        ← Back to index
      </Link>

      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">{name}</h1>
        <p className="text-gray-500 font-mono text-sm">{slug}.jsx</p>

        {mod?.meta?.tags && mod.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
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
      </div>

      {/* Live component render */}
      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          Preview
        </h2>
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 min-h-[120px] flex items-center justify-center">
          {mod ? (
            <ErrorBoundary>
              <div className="w-full">
                <mod.Component />
              </div>
            </ErrorBoundary>
          ) : (
            <span className="text-gray-600 text-sm animate-pulse">Loading…</span>
          )}
        </div>
      </section>

      {/* Source code */}
      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          Source
        </h2>
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
      </section>
    </div>
  )
}
