export const meta = {
  tags: ["example", "ui"],
}

export default function Example() {
  return (
    <div className="rounded-lg border border-indigo-500/40 bg-indigo-950/40 p-6 text-center space-y-2 max-w-xs mx-auto">
      <div className="text-3xl">✨</div>
      <h3 className="text-white font-semibold text-sm">Example Component</h3>
      <p className="text-gray-400 text-xs leading-relaxed">
        Drop any <code className="text-indigo-300 font-mono">.jsx</code> file into{" "}
        <code className="text-indigo-300 font-mono">src/components/</code> and it
        appears here automatically.
      </p>
    </div>
  )
}
