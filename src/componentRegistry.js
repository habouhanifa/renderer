/**
 * Auto-discovers all .jsx files placed in src/components/.
 * Uses Vite's import.meta.glob — no manual registration needed.
 *
 * Each entry exposes:
 *   { name, slug, module, rawSource }
 *
 * `module` is a lazy import returning { default: Component, meta? }
 * `rawSource` is the raw source string (also loaded via ?raw)
 */

// Lazy component modules  (default + optional meta)
const moduleGlobs = import.meta.glob('./components/*.jsx')

// Raw source strings
const sourceGlobs = import.meta.glob('./components/*.jsx', { as: 'raw' })

/**
 * Convert a filename like "MyComponent.jsx" → "My Component"
 */
export function fileNameToTitle(filename) {
  return filename
    .replace(/\.jsx$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    // Capitalise first letter in case it starts lower-case
    .replace(/^./, (c) => c.toUpperCase())
}

/**
 * Convert a filename like "MyComponent.jsx" → "MyComponent"
 */
export function fileNameToSlug(filename) {
  return filename.replace(/\.jsx$/, '')
}

/**
 * Returns an array of component descriptors, sorted alphabetically.
 * Call loadComponent(descriptor) to get the resolved module + source.
 */
export function getComponentDescriptors() {
  return Object.keys(moduleGlobs)
    .map((path) => {
      const filename = path.split('/').pop()
      return {
        path,
        filename,
        name: fileNameToTitle(filename),
        slug: fileNameToSlug(filename),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Loads a component's module and raw source by slug.
 * Returns { Component, meta, source } or null if not found.
 */
export async function loadComponentBySlug(slug) {
  const path = `./components/${slug}.jsx`
  const loadModule = moduleGlobs[path]
  const loadSource = sourceGlobs[path]

  if (!loadModule) return null

  const [mod, source] = await Promise.all([loadModule(), loadSource()])

  return {
    Component: mod.default,
    meta: mod.meta ?? null,
    source,
  }
}
