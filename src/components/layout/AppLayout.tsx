import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import logoSvg from '@/assets/logo.svg'
import { HomeIcon, LibraryIcon, MessageIcon, SearchIcon, UserIcon } from '@/components/icons'

/** Top bar on ≥ md, bottom tab bar on mobile (SPEC-frontend §4). */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <TopNav />
      {/* Bottom padding keeps content clear of the mobile tab bar. */}
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6 md:pb-12 md:pt-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

function TopNav() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-medium transition',
      isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
    )

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 md:h-16 md:px-6">
        <Link to="/" className="shrink-0" aria-label="Gamex">
          <img src={logoSvg} alt="Gamex" className="h-7" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.main')}>
          <NavLink to="/" end className={linkClass}>{t('nav.home')}</NavLink>
          <NavLink to="/games" className={linkClass}>{t('nav.games')}</NavLink>
        </nav>

        <div className="ml-auto">
          {user ? (
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold"
              aria-label={t('nav.profile')}
            >
              {user.username.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  const { t } = useTranslation()

  const tabs = [
    { to: '/', label: t('nav.home'), icon: HomeIcon, end: true },
    { to: '/games', label: t('nav.search'), icon: SearchIcon, end: false },
    { to: '/library', label: t('nav.library'), icon: LibraryIcon, end: false },
    { to: '/messages', label: t('nav.messages'), icon: MessageIcon, end: false },
    { to: '/profile', label: t('nav.profile'), icon: UserIcon, end: false },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label={t('nav.main')}
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ to, label, icon: TabIcon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition',
                  isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                )
              }
            >
              <TabIcon />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
