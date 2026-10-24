import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      className={cn('inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500', className)}
    >
      <span className="sr-only">…</span>
    </span>
  )
}

interface MessageProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: MessageProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
      <p className="font-medium text-zinc-200">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry, title }: { onRetry?: () => void; title?: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
      <p className="font-medium text-red-300">{title ?? t('common.errorTitle')}</p>
      <p className="mt-1 text-sm text-zinc-500">{t('common.errorDescription')}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
        >
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
