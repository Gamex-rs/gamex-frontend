import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

/** Sends guests to /login?redirect=<current path> (SPEC-frontend §3). */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return children
}
