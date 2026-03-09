export const meta = {
  tags: ["ui", "display"],
}

const VARIANTS = [
  { label: "Success", bg: "bg-emerald-900", text: "text-emerald-300", dot: "bg-emerald-400" },
  { label: "Warning", bg: "bg-yellow-900", text: "text-yellow-300", dot: "bg-yellow-400" },
  { label: "Error",   bg: "bg-red-900",     text: "text-red-300",     dot: "bg-red-400"     },
  { label: "Info",    bg: "bg-blue-900",    text: "text-blue-300",    dot: "bg-blue-400"    },
]

export default function Badge() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {VARIANTS.map(({ label, bg, text, dot }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-1.5 ${bg} ${text} text-xs font-medium px-2.5 py-1 rounded-full`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      ))}
    </div>
  )
}
