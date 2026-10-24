import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isAxiosError } from 'axios'
import { ChevronLeftIcon } from '@/components/icons'
import { EmptyState, ErrorState } from '@/components/StatusViews'
import { useGame } from '@/hooks/useGames'
import { formatDate, formatNumber } from '@/lib/format'
import GameCover from './GameCover'
import MetacriticBadge from './MetacriticBadge'
import PlatformChips from './PlatformChips'

/**
 * Game detail from the Game Catalog Service. Listings for the game, library badges and the
 * "Add to my library" action need the User Library Service and are added with it.
 */
export default function GameDetailPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const game = useGame(id)

  if (game.isLoading) return <DetailSkeleton />

  if (game.isError) {
    const notFound = isAxiosError(game.error) && (game.error.response?.status === 404 || game.error.response?.status === 400)
    return (
      <div className="space-y-6">
        <BackLink />
        {notFound ? (
          <EmptyState
            title={t('gameDetail.notFound.title')}
            description={t('gameDetail.notFound.description')}
            action={<Link to="/games" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">{t('common.browseGames')}</Link>}
          />
        ) : (
          <ErrorState onRetry={() => game.refetch()} />
        )}
      </div>
    )
  }

  const data = game.data!
  const { stats } = data

  return (
    <article className="space-y-8">
      <BackLink />

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <GameCover src={data.coverImageUrl} title={data.title} className="mx-auto w-48 shrink-0 shadow-2xl shadow-black/40 sm:mx-0 md:w-64" />

        <div className="min-w-0 space-y-4">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">{data.title}</h1>
            {data.metacritic !== null && <MetacriticBadge score={data.metacritic} className="mt-1.5 shrink-0 px-2 py-1 text-sm" />}
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            {data.releaseDate && (
              <>
                <dt className="text-zinc-500">{t('gameDetail.releaseDate')}</dt>
                <dd className="text-zinc-200">{formatDate(data.releaseDate)}</dd>
              </>
            )}
            {data.platforms.length > 0 && (
              <>
                <dt className="pt-0.5 text-zinc-500">{t('gameDetail.platforms')}</dt>
                <dd><PlatformChips platforms={data.platforms} /></dd>
              </>
            )}
            {data.genres.length > 0 && (
              <>
                <dt className="text-zinc-500">{t('gameDetail.genres')}</dt>
                <dd className="text-zinc-200">{data.genres.map((g) => g.name).join(', ')}</dd>
              </>
            )}
          </dl>

          {/* SPEC-frontend §5.3 aggregate stats bar */}
          <ul className="flex flex-wrap gap-2 pt-2">
            <StatPill value={stats.ownedCount} label={t('gameDetail.stats.owned', { count: stats.ownedCount })} />
            <StatPill value={stats.wishlistCount} label={t('gameDetail.stats.wishlist', { count: stats.wishlistCount })} />
            <StatPill value={stats.forExchangeCount} label={t('gameDetail.stats.exchange', { count: stats.forExchangeCount })} />
            <StatPill value={stats.forSaleCount} label={t('gameDetail.stats.sale', { count: stats.forSaleCount })} />
          </ul>
        </div>
      </div>

      {data.description && (
        <section className="max-w-3xl space-y-3">
          <h2 className="text-lg font-semibold">{t('gameDetail.about')}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400">{data.description}</p>
        </section>
      )}
    </article>
  )
}

function StatPill({ value, label }: { value: number; label: string }) {
  return (
    <li className="rounded-xl bg-zinc-900 px-3.5 py-2 text-sm">
      <span className="font-semibold tabular-nums text-white">{formatNumber(value)}</span>{' '}
      <span className="text-zinc-400">{label}</span>
    </li>
  )
}

function BackLink() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // Go back when we came from inside the app (keeps catalog filters and page); otherwise open the catalog.
  const canGoBack = window.history.state?.idx > 0

  return (
    <button
      type="button"
      onClick={() => (canGoBack ? navigate(-1) : navigate('/games'))}
      className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition hover:text-white"
    >
      <ChevronLeftIcon width={16} height={16} />
      {t('gameDetail.back')}
    </button>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8" aria-hidden="true">
      <div className="mx-auto aspect-[3/4] w-48 animate-pulse rounded-xl bg-zinc-900 sm:mx-0 md:w-64" />
      <div className="flex-1 space-y-4">
        <div className="h-9 w-2/3 animate-pulse rounded-lg bg-zinc-900" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-900" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-900" />
      </div>
    </div>
  )
}
