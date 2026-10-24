import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterIcon } from '@/components/icons'
import { EmptyState, ErrorState, Spinner } from '@/components/StatusViews'
import { useGames } from '@/hooks/useGames'
import { useAuthStore } from '@/stores/authStore'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import CatalogFilters from './CatalogFilters'
import GameCard from './GameCard'
import GameSearchBox from './GameSearchBox'
import Pagination from './Pagination'
import { PAGE_SIZE, SORT_OPTIONS, useCatalogFilters, type SortValue } from './useCatalogFilters'

export default function GameCatalogPage() {
  const { t } = useTranslation()
  const { filters, update, apiParams, activeFilterCount, hasPlatformParam } = useCatalogFilters()
  const games = useGames(apiParams)
  const [filtersOpen, setFiltersOpen] = useState(false)

  usePreferredPlatforms(hasPlatformParam, (platformIds) => update({ platformIds }, { replace: true }))

  const changePage = (page: number) => {
    update({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('catalog.title')}</h1>
        <GameSearchBox value={filters.q} onSubmit={(q) => update({ q })} />
      </header>

      {/* Above both columns, so on mobile the filter panel opens below its toggle. */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 md:hidden"
        >
          <FilterIcon width={16} height={16} />
          {t('catalog.filters.toggle')}
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-indigo-600 px-1.5 text-xs text-white">{activeFilterCount}</span>
          )}
        </button>

        <p className="hidden text-sm text-zinc-500 md:block">
          {games.data && t('catalog.resultCount', { count: games.data.totalCount, formatted: formatNumber(games.data.totalCount) })}
        </p>

        <div className="ml-auto flex items-center gap-2">
          {games.isFetching && !games.isLoading && <Spinner className="h-4 w-4" />}
          <label htmlFor="sort" className="sr-only">{t('catalog.sort.label')}</label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortValue })}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Desktop: always-visible sidebar. Mobile: toggled panel. */}
        <aside id="catalog-filters" className={cn('md:block md:w-56 md:shrink-0', filtersOpen ? 'block' : 'hidden')}>
          <div className="rounded-2xl border border-zinc-800 p-4 md:sticky md:top-24 md:border-0 md:p-0">
            <CatalogFilters filters={filters} onChange={update} />
          </div>
        </aside>

        <section className="min-w-0 flex-1 space-y-5" aria-busy={games.isFetching}>
          {games.isLoading ? (
            <GridSkeleton />
          ) : games.isError ? (
            <ErrorState onRetry={() => games.refetch()} />
          ) : games.data && games.data.items.length === 0 ? (
            <EmptyState
              title={t('catalog.empty.title')}
              description={filters.q || activeFilterCount > 0 ? t('catalog.empty.filtered') : t('catalog.empty.catalog')}
              action={
                (filters.q || activeFilterCount > 0) && (
                  <button
                    type="button"
                    onClick={() => update({ q: '', platformIds: [], genreId: '' })}
                    className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
                  >
                    {t('catalog.filters.clearAll')}
                  </button>
                )
              }
            />
          ) : (
            <>
              <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', games.isPlaceholderData && 'opacity-60 transition-opacity')}>
                {games.data?.items.map((game) => (
                  <li key={game.id}>
                    <GameCard game={game} />
                  </li>
                ))}
              </ul>
              {games.data && (
                <Pagination page={games.data.page} totalPages={games.data.totalPages} onChange={changePage} />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

/**
 * SPEC-frontend §5.2: for an authenticated user with platform preferences, pre-fill the platform filter once
 * when the URL has none. The user can change or clear it afterwards.
 */
function usePreferredPlatforms(hasPlatformParam: boolean, apply: (platformIds: string[]) => void) {
  const { user, platformIds } = useAuthStore()
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current) return
    applied.current = true
    if (user && platformIds.length > 0 && !hasPlatformParam) {
      apply(platformIds)
    }
  }, [user, platformIds, hasPlatformParam, apply])
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-hidden="true">
      {Array.from({ length: PAGE_SIZE / 2 }, (_, i) => (
        <li key={i} className="space-y-2.5 p-1.5">
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-zinc-900" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-900" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-900" />
        </li>
      ))}
    </ul>
  )
}
