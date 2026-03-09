export const meta = {
  tags: ["form", "ui"],
}

export default function InputField() {
  return (
    <div className="space-y-4 w-full max-w-xs mx-auto">
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-400">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-400">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-400 flex justify-between">
          <span>Message</span>
          <span className="text-gray-600">optional</span>
        </label>
        <textarea
          rows={3}
          placeholder="Type something…"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  )
}
