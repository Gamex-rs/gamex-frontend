import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/StatusViews'

/** Placeholder for routes whose backend (User Library, Messaging, …) is not built yet. */
export default function NotImplementedPage({ label }: { label: string }) {
  const { t } = useTranslation()
  return (
    <EmptyState
      title={label}
      description={t('common.comingSoon')}
      action={
        <Link to="/games" className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300">
          {t('common.browseGames')}
        </Link>
      }
    />
  )
}
