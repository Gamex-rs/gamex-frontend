import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CloseIcon, SearchIcon } from '@/components/icons'
import { Spinner } from '@/components/StatusViews'
import { SEARCH_MIN_LENGTH, useGameSearch } from '@/hooks/useGames'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { releaseYear } from '@/lib/format'
import { cn } from '@/lib/utils'
import GameCover from './GameCover'

interface GameSearchBoxProps {
  /** Current title filter of the list. */
  value: string
  /** Submitting (Enter without a highlighted suggestion) filters the list by title. */
  onSubmit: (q: string) => void
}

/**
 * Autocomplete over `/games/search` (debounced). That endpoint also imports matching games from RAWG,
 * so suggestions can include games not yet in the list; picking one opens its detail page.
 */
export default function GameSearchBox({ value, onSubmit }: GameSearchBoxProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  // Follow external changes, e.g. "clear filters" or back/forward navigation.
  useEffect(() => setInput(value), [value])

  const debounced = useDebouncedValue(input.trim())
  const search = useGameSearch(debounced)
  const suggestions = open && debounced.length >= SEARCH_MIN_LENGTH ? (search.data ?? []) : []
  const showPanel = open && debounced.length >= SEARCH_MIN_LENGTH

  useEffect(() => setHighlighted(-1), [debounced])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const openGame = (id: string) => {
    setOpen(false)
    navigate(`/games/${id}`)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (highlighted >= 0 && suggestions[highlighted]) {
      openGame(suggestions[highlighted].id)
      return
    }
    setOpen(false)
    onSubmit(input.trim())
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault()
      setOpen(true)
      setHighlighted((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault()
      setHighlighted((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const clear = () => {
    setInput('')
    onSubmit('')
  }

  return (
    <div ref={containerRef} className="relative">
      <form role="search" onSubmit={handleSubmit}>
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('catalog.search.placeholder')}
          aria-label={t('catalog.search.placeholder')}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={highlighted >= 0 ? `${listId}-${highlighted}` : undefined}
          className={cn(
            'w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-10 text-sm text-white',
            'placeholder:text-zinc-500 outline-none transition [&::-webkit-search-cancel-button]:hidden',
            'focus:border-transparent focus:ring-2 focus:ring-indigo-500'
          )}
        />
        {input && (
          <button
            type="button"
            onClick={clear}
            aria-label={t('catalog.search.clear')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:text-zinc-300"
          >
            <CloseIcon width={16} height={16} />
          </button>
        )}
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
          {search.isFetching && suggestions.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-zinc-400">
              <Spinner className="h-4 w-4" />
              {t('catalog.search.searching')}
            </div>
          ) : search.isError ? (
            <p className="px-4 py-4 text-sm text-red-400">{t('common.errorTitle')}</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-4 text-sm text-zinc-500">{t('catalog.search.noResults')}</p>
          ) : (
            <ul id={listId} role="listbox" className="max-h-96 overflow-y-auto py-1">
              {suggestions.map((game, index) => (
                <li
                  key={game.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === highlighted}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => openGame(game.id)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-3 py-2 transition',
                    index === highlighted ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'
                  )}
                >
                  <GameCover src={game.coverImageUrl} title={game.title} className="w-9 shrink-0 rounded-md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">{game.title}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {[releaseYear(game.releaseDate), game.platforms.map((p) => p.name).join(', ')]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
