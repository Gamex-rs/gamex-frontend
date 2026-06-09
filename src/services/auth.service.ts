import api from '@/lib/axios'
import type { AuthResponse, LoginRequest } from '@/types/auth'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/v1/auth/login', data).then((r) => r.data),

  logout: () => api.post('/api/v1/auth/logout'),
}
