// Mirrors the Game Catalog Service API (SPEC-game-catalog-svc.md §3).

export interface Platform {
  id: string
  name: string
  slug: string
}

export interface Genre {
  id: string
  name: string
  slug: string
}

export interface GameStats {
  ownedCount: number
  wishlistCount: number
  forExchangeCount: number
  forSaleCount: number
  wantToBuyCount: number
}

export interface GameSummary {
  id: string
  title: string
  coverImageUrl: string | null
  /** ISO date, e.g. "2022-02-25" */
  releaseDate: string | null
  metacritic: number | null
  platforms: Platform[]
  stats: GameStats
}

export interface GameDetail extends GameSummary {
  description: string | null
  rawgSlug: string | null
  genres: Genre[]
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type GameSortBy = 'title' | 'releaseDate' | 'metacritic' | 'ownedCount'
export type SortDirection = 'asc' | 'desc'

export interface GameListParams {
  q?: string
  platformIds?: string[]
  genreId?: string
  sortBy?: GameSortBy
  sortDir?: SortDirection
  page?: number
  pageSize?: number
}
