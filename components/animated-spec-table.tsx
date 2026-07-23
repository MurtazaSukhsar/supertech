export function AnimatedSpecTable({ specs }: { specs: Record<string, string> }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {Object.entries(specs).map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-secondary/60' : 'bg-background'}>
              <th
                scope="row"
                className="w-2/5 border-b border-border px-5 py-3.5 text-left font-bold text-foreground"
              >
                {key}
              </th>
              <td className="border-b border-border px-5 py-3.5 font-semibold text-foreground">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
