import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth.service'
import { cn } from '@/lib/utils'
import logoSvg from '@/assets/logo.svg'

const loginSchema = z.object({
  email: z.string().email('auth.login.errors.invalidEmail'),
  password: z.string().min(1, 'auth.login.errors.passwordRequired'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, setAuth } = useAuthStore()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      const redirect = searchParams.get('redirect') ?? '/'
      navigate(redirect, { replace: true })
    },
  })

  const onSubmit = (data: LoginForm) => loginMutation.mutate(data)

  const handleOAuth = (provider: 'google' | 'facebook') => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/oauth/${provider}`
  }

  const isInvalidCredentials =
    loginMutation.isError &&
    (loginMutation.error as { response?: { status: number } })?.response?.status === 401

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoSvg} alt="Gamex" className="h-10 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">{t('auth.login.subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          {/* Error banner */}
          {loginMutation.isError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {isInvalidCredentials
                ? t('auth.login.errors.invalidCredentials')
                : t('auth.login.errors.generic')}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder={t('auth.login.emailPlaceholder')}
                {...register('email')}
                className={cn(
                  'w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-white',
                  'placeholder:text-zinc-500 outline-none transition',
                  'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                  errors.email ? 'border-red-500' : 'border-zinc-700'
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{t(errors.email.message!)}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-300">
                  {t('auth.login.password')}
                </label>
                <a
                  href="#"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  {t('auth.login.forgotPassword')}
                </a>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder={t('auth.login.passwordPlaceholder')}
                {...register('password')}
                className={cn(
                  'w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-white',
                  'placeholder:text-zinc-500 outline-none transition',
                  'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                  errors.password ? 'border-red-500' : 'border-zinc-700'
                )}
              />
              {errors.password && (
                <p className="text-xs text-red-400">{t(errors.password.message!)}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={cn(
                'w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium',
                'py-2.5 px-4 rounded-lg text-sm transition',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900'
              )}
            >
              {loginMutation.isPending ? t('auth.login.submitting') : t('auth.login.submit')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-900 px-3 text-xs text-zinc-500">
                {t('auth.login.orContinueWith')}
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className={cn(
                'flex items-center justify-center gap-2',
                'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700',
                'rounded-lg py-2.5 px-3 text-sm text-zinc-300 transition',
                'focus:outline-none focus:ring-2 focus:ring-zinc-500'
              )}
            >
              <GoogleIcon />
              {t('auth.login.continueWithGoogle')}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('facebook')}
              className={cn(
                'flex items-center justify-center gap-2',
                'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700',
                'rounded-lg py-2.5 px-3 text-sm text-zinc-300 transition',
                'focus:outline-none focus:ring-2 focus:ring-zinc-500'
              )}
            >
              <FacebookIcon />
              {t('auth.login.continueWithFacebook')}
            </button>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          {t('auth.login.noAccount')}{' '}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            {t('auth.login.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.031 4.388 11.032 10.125 11.927V15.57H7.078v-3.497h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.497h-2.796v8.43C19.612 23.105 24 18.104 24 12.073z" />
    </svg>
  )
}
