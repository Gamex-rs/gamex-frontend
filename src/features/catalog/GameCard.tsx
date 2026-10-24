import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { GameSummary } from '@/types/games'
import { formatNumber, releaseYear } from '@/lib/format'
import GameCover from './GameCover'
import MetacriticBadge from './MetacriticBadge'
import PlatformChips from './PlatformChips'

export default function GameCard({ game }: { game: GameSummary }) {
  const { t } = useTranslation()
  const year = releaseYear(game.releaseDate)

  return (
    <Link
      to={`/games/${game.id}`}
      className="group flex flex-col gap-2.5 rounded-2xl p-1.5 outline-none transition hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <GameCover src={game.coverImageUrl} title={game.title} className="transition group-hover:brightness-110" />

      <div className="flex flex-1 flex-col gap-1.5 px-1 pb-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">{game.title}</h3>
          {game.metacritic !== null && <MetacriticBadge score={game.metacritic} className="shrink-0" />}
        </div>

        {year && <p className="text-xs text-zinc-500">{year}</p>}

        <PlatformChips platforms={game.platforms} max={3} />

        {/* Aggregate stats (SPEC-frontend §5.2): owned / wishlist / exchange */}
        <p className="mt-auto pt-1 text-[11px] text-zinc-500">
          {t('catalog.card.stats', {
            owned: formatNumber(game.stats.ownedCount),
            wishlist: formatNumber(game.stats.wishlistCount),
            exchange: formatNumber(game.stats.forExchangeCount),
          })}
        </p>
      </div>
    </Link>
  )
}
