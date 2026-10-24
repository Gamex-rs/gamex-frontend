import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/** Metacritic colour bands: 75+ green, 50–74 yellow, below red. */
export default function MetacriticBadge({ score, className }: { score: number; className?: string }) {
  const { t } = useTranslation()
  return (
    <span
      title={t('catalog.metacritic')}
      className={cn(
        'inline-flex min-w-8 items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums',
        score >= 75 ? 'bg-emerald-500/15 text-emerald-400' : score >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400',
        className
      )}
    >
      {score}
    </span>
  )
}
