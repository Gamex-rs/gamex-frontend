import { useTranslation } from 'react-i18next'
import { usePlatforms, useGenres } from '@/hooks/useGames'
import { cn } from '@/lib/utils'
import type { CatalogFilters as Filters } from './useCatalogFilters'

interface CatalogFiltersProps {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
}

/** Platform (multi-select, matches any) and genre filters. Sidebar on desktop, collapsible panel on mobile. */
export default function CatalogFilters({ filters, onChange }: CatalogFiltersProps) {
  const { t } = useTranslation()
  const platforms = usePlatforms()
  const genres = useGenres()

  const togglePlatform = (id: string) =>
    onChange({
      platformIds: filters.platformIds.includes(id)
        ? filters.platformIds.filter((p) => p !== id)
        : [...filters.platformIds, id],
    })

  const hasFilters = filters.platformIds.length > 0 || filters.genreId !== ''

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {t('catalog.filters.platforms')}
        </legend>
        {platforms.isLoading ? (
          <FilterSkeleton />
        ) : platforms.isError ? (
          <p className="text-sm text-red-400">{t('common.errorTitle')}</p>
        ) : platforms.data?.length === 0 ? (
          <p className="text-sm text-zinc-500">{t('catalog.filters.none')}</p>
        ) : (
          <div className="flex flex-wrap gap-2 md:flex-col md:gap-1">
            {platforms.data?.map((platform) => {
              const checked = filters.platformIds.includes(platform.id)
              return (
                <label
                  key={platform.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition md:px-2',
                    'border md:border-0',
                    checked
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-white md:bg-transparent'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePlatform(platform.id)}
                    className="hidden h-4 w-4 rounded border-zinc-600 bg-zinc-800 accent-indigo-500 md:block"
                  />
                  {platform.name}
                </label>
              )
            })}
          </div>
        )}
      </fieldset>

      <div>
        <label htmlFor="genre-filter" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {t('catalog.filters.genre')}
        </label>
        <select
          id="genre-filter"
          value={filters.genreId}
          onChange={(e) => onChange({ genreId: e.target.value })}
          disabled={genres.isLoading || genres.isError}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{t('catalog.filters.allGenres')}</option>
          {genres.data?.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange({ platformIds: [], genreId: '' })}
          className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          {t('catalog.filters.clear')}
        </button>
      )}
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-7 animate-pulse rounded-lg bg-zinc-900" />
      ))}
    </div>
  )
}
