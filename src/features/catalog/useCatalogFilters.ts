import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { GameListParams, GameSortBy, SortDirection } from '@/types/games'

export const PAGE_SIZE = 20

/** Sort options shown in the UI; each maps to the API's sortBy + sortDir. */
export const SORT_OPTIONS = [
  { value: 'title:asc', labelKey: 'catalog.sort.title' },
  { value: 'ownedCount:desc', labelKey: 'catalog.sort.popular' },
  { value: 'releaseDate:desc', labelKey: 'catalog.sort.newest' },
  { value: 'metacritic:desc', labelKey: 'catalog.sort.topRated' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']
const DEFAULT_SORT: SortValue = 'title:asc'

function parseSort(value: string | null): SortValue {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortValue) : DEFAULT_SORT
}

export interface CatalogFilters {
  q: string
  platformIds: string[]
  genreId: string
  sort: SortValue
  page: number
}

/** Catalog filters live in the URL so filtered views are shareable and survive back/forward. */
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<CatalogFilters>(() => {
    const page = Number(params.get('page'))
    return {
      q: params.get('q') ?? '',
      platformIds: params.getAll('platformIds'),
      genreId: params.get('genreId') ?? '',
      sort: parseSort(params.get('sort')),
      page: Number.isInteger(page) && page > 0 ? page : 1,
    }
  }, [params])

  /** Applies a change; any change other than the page itself goes back to page 1. */
  const update = useCallback(
    (patch: Partial<CatalogFilters>, options?: { replace?: boolean }) => {
      const next = { ...filters, page: 1, ...patch }
      const search = new URLSearchParams()
      if (next.q) search.set('q', next.q)
      next.platformIds.forEach((id) => search.append('platformIds', id))
      if (next.genreId) search.set('genreId', next.genreId)
      if (next.sort !== DEFAULT_SORT) search.set('sort', next.sort)
      if (next.page > 1) search.set('page', String(next.page))
      setParams(search, { replace: options?.replace })
    },
    [filters, setParams]
  )

  const apiParams = useMemo<GameListParams>(() => {
    const [sortBy, sortDir] = filters.sort.split(':') as [GameSortBy, SortDirection]
    return {
      q: filters.q || undefined,
      platformIds: filters.platformIds.length > 0 ? filters.platformIds : undefined,
      genreId: filters.genreId || undefined,
      sortBy,
      sortDir,
      page: filters.page,
      pageSize: PAGE_SIZE,
    }
  }, [filters])

  const activeFilterCount = filters.platformIds.length + (filters.genreId ? 1 : 0)

  return { filters, update, apiParams, activeFilterCount, hasPlatformParam: params.has('platformIds') }
}
