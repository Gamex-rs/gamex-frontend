import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'

// Placeholder for routes not yet implemented
function NotImplemented({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
      {label} — not yet implemented
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/', element: <NotImplemented label="Home" /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <NotImplemented label="Register" /> },
  { path: '/auth/callback', element: <NotImplemented label="OAuth Callback" /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
