export const meta = {
  tags: ["ui", "button"],
}

export default function Button() {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
        Primary
      </button>
      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
        Secondary
      </button>
      <button className="px-4 py-2 border border-gray-500 hover:border-gray-300 text-gray-300 text-sm font-medium rounded-lg transition-colors">
        Outline
      </button>
      <button
        disabled
        className="px-4 py-2 bg-gray-800 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
      >
        Disabled
      </button>
    </div>
  )
}
