import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { gamesService } from '@/services/games.service'
import type { GameListParams } from '@/types/games'

export const SEARCH_MIN_LENGTH = 2

export const gameKeys = {
  all: ['games'] as const,
  list: (params: GameListParams) => [...gameKeys.all, 'list', params] as const,
  search: (q: string) => [...gameKeys.all, 'search', q] as const,
  detail: (id: string) => [...gameKeys.all, 'detail', id] as const,
  platforms: ['platforms'] as const,
  genres: ['genres'] as const,
}

export function useGames(params: GameListParams) {
  return useQuery({
    queryKey: gameKeys.list(params),
    queryFn: ({ signal }) => gamesService.list(params, signal),
    // Keep the current page visible while the next one loads.
    placeholderData: keepPreviousData,
  })
}

export function useGameSearch(q: string) {
  const term = q.trim()
  return useQuery({
    queryKey: gameKeys.search(term),
    queryFn: ({ signal }) => gamesService.search(term, signal),
    enabled: term.length >= SEARCH_MIN_LENGTH,
    staleTime: 60_000,
  })
}

export function useGame(id: string) {
  return useQuery({
    queryKey: gameKeys.detail(id),
    queryFn: ({ signal }) => gamesService.get(id, signal),
    // A missing game will not appear on retry.
    retry: (failureCount, error) => !(isAxiosError(error) && error.response?.status === 404) && failureCount < 1,
  })
}

/** Platforms and genres change rarely; cache them for the session. */
export function usePlatforms() {
  return useQuery({
    queryKey: gameKeys.platforms,
    queryFn: ({ signal }) => gamesService.platforms(signal),
    staleTime: Infinity,
  })
}

export function useGenres() {
  return useQuery({
    queryKey: gameKeys.genres,
    queryFn: ({ signal }) => gamesService.genres(signal),
    staleTime: Infinity,
  })
}
