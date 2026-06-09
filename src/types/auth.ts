export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  role: 'user' | 'admin'
  platformIds: string[]
}
