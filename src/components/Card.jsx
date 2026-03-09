export const meta = {
  tags: ["ui", "layout"],
}

export default function Card() {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden w-64 mx-auto shadow-xl">
      <div className="h-24 bg-gradient-to-br from-indigo-600 to-purple-600" />
      <div className="p-4 space-y-2">
        <h3 className="text-white font-semibold text-sm">Card Title</h3>
        <p className="text-gray-400 text-xs leading-relaxed">
          A simple card component with a gradient header, title, and description area.
        </p>
        <button className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
          Learn more →
        </button>
      </div>
    </div>
  )
}
