import { createBrowserRouter, Navigate } from 'react-router-dom'
import i18n from '@/lib/i18n'
import LoginPage from '@/features/auth/LoginPage'
import GameCatalogPage from '@/features/catalog/GameCatalogPage'
import GameDetailPage from '@/features/catalog/GameDetailPage'
import AppLayout from '@/components/layout/AppLayout'
import NotImplementedPage from '@/components/NotImplementedPage'
import RequireAuth from './RequireAuth'

const placeholder = (key: string) => <NotImplementedPage label={i18n.t(key)} />
const protectedPlaceholder = (key: string) => <RequireAuth>{placeholder(key)}</RequireAuth>

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Public routes backed by the Game Catalog Service.
      { path: '/games', element: <GameCatalogPage /> },
      { path: '/games/:id', element: <GameDetailPage /> },

      // Need the User Library Service.
      { path: '/', element: placeholder('pages.home') },
      { path: '/listings', element: placeholder('pages.listings') },
      { path: '/listings/:id', element: placeholder('pages.listing') },
      { path: '/users/:id', element: placeholder('pages.user') },
      { path: '/library', element: protectedPlaceholder('pages.library') },
      { path: '/library/add', element: protectedPlaceholder('pages.libraryAdd') },
      { path: '/messages', element: protectedPlaceholder('pages.messages') },
      { path: '/messages/:conversationId', element: protectedPlaceholder('pages.messages') },
      { path: '/notifications', element: protectedPlaceholder('pages.notifications') },
      { path: '/profile', element: protectedPlaceholder('pages.profile') },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: placeholder('pages.register') },
  { path: '/auth/callback', element: placeholder('pages.authCallback') },
  { path: '*', element: <Navigate to="/" replace /> },
])
