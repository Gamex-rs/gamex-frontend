import { useState } from 'react'
import { GamepadIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

/**
 * 3:4 cover with a placeholder. Covers are copied to S3 in the background after a game is imported,
 * so a fresh game briefly has no cover; a broken URL falls back to the placeholder too.
 */
export default function GameCover({ src, title, className }: { src: string | null; title: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div className={cn('relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900', className)}>
      {showImage ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-600">
          <GamepadIcon width={40} height={40} />
        </div>
      )}
    </div>
  )
}
