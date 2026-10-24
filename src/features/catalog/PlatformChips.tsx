import type { Platform } from '@/types/games'
import { cn } from '@/lib/utils'

export default function PlatformChips({ platforms, max, className }: { platforms: Platform[]; max?: number; className?: string }) {
  const shown = max === undefined ? platforms : platforms.slice(0, max)
  const hidden = platforms.length - shown.length

  return (
    <ul className={cn('flex flex-wrap gap-1', className)}>
      {shown.map((p) => (
        <li key={p.id} className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[11px] font-medium text-zinc-300">
          {p.name}
        </li>
      ))}
      {hidden > 0 && (
        <li className="rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500" title={platforms.slice(shown.length).map((p) => p.name).join(', ')}>
          +{hidden}
        </li>
      )}
    </ul>
  )
}
