import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  const button = 'flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav className="flex items-center justify-center gap-3" aria-label={t('catalog.pagination.label')}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={cn(button, 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800')}
      >
        <ChevronLeftIcon width={16} height={16} />
        {t('catalog.pagination.previous')}
      </button>
      <span className="text-sm tabular-nums text-zinc-500">
        {t('catalog.pagination.status', { page, total: totalPages })}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(button, 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800')}
      >
        {t('catalog.pagination.next')}
        <ChevronRightIcon width={16} height={16} />
      </button>
    </nav>
  )
}
