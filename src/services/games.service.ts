import api from '@/lib/axios'
import type { GameDetail, GameListParams, GameSummary, Genre, PagedResult, Platform } from '@/types/games'

/** Repeats array params (`platformIds=a&platformIds=b`) as the catalog API expects. */
function toSearchParams(params: GameListParams): URLSearchParams {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  params.platformIds?.forEach((id) => search.append('platformIds', id))
  if (params.genreId) search.set('genreId', params.genreId)
  if (params.sortBy) search.set('sortBy', params.sortBy)
  if (params.sortDir) search.set('sortDir', params.sortDir)
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  return search
}

export const gamesService = {
  list: (params: GameListParams, signal?: AbortSignal) =>
    api
      .get<PagedResult<GameSummary>>('/api/v1/games', { params: toSearchParams(params), signal })
      .then((r) => r.data),

  /** Autocomplete; may import games from RAWG when few local matches exist. */
  search: (q: string, signal?: AbortSignal) =>
    api.get<GameSummary[]>('/api/v1/games/search', { params: { q }, signal }).then((r) => r.data),

  get: (id: string, signal?: AbortSignal) =>
    api.get<GameDetail>(`/api/v1/games/${id}`, { signal }).then((r) => r.data),

  platforms: (signal?: AbortSignal) =>
    api.get<Platform[]>('/api/v1/platforms', { signal }).then((r) => r.data),

  genres: (signal?: AbortSignal) =>
    api.get<Genre[]>('/api/v1/genres', { signal }).then((r) => r.data),
}
