import { api } from './apiClient'

export type CurrentUser = {
  id?: string
  username?: string
  nombre?: string
  role?: string
} | null

type Listener = (user: CurrentUser) => void

class UserStore {
  private user: CurrentUser = null
  private listeners = new Set<Listener>()
  private isFetching = false

  getUser() {
    return this.user
  }

  setUser(u: CurrentUser) {
    this.user = u
    this.emit()
  }

  clearUser() {
    this.user = null
    this.emit()
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit() {
    for (const l of this.listeners) l(this.user)
  }

  /**
   * Check if there's likely an active session by checking for access_token cookie.
   */
  private hasSession(): boolean {
    if (typeof document === 'undefined') return false
    const cookies = document.cookie.split(';')
    return cookies.some((c) => c.trim().startsWith('access_token='))
  }

  async fetchCurrentUser() {
    // Don't attempt to fetch if there's no session cookie
    if (!this.hasSession()) {
      console.debug('userStore: no session cookie found')
      this.clearUser()
      return null
    }

    // Avoid redundant parallel fetches
    if (this.isFetching) {
      console.debug('userStore: already fetching, returning cached user:', this.user)
      return this.user
    }

    // If we already have user data, don't fetch again
    if (this.user) {
      console.debug('userStore: already have user data, returning:', this.user)
      return this.user
    }

    console.debug('userStore: fetching current user from /api/auth/me')
    this.isFetching = true
    try {
      const res = await api.get('/api/auth/me')
      console.debug('userStore: fetch response:', res)
      if (res.success) {
        // Handle both response structures:
        // 1. Backend returns { user: {...} } and apiClient wraps it: res.data = { user: {...} }
        // 2. Or apiClient extracts it differently
        const userData = res.data?.user ?? res.data
        console.debug('userStore: extracted user data:', userData)
        if (userData) {
          this.setUser(userData)
          return userData
        }
      }
      // Only clear user if we explicitly got a 401 or bad response, not on network errors
      if (res.errorMessage?.includes('No tienes permisos')) {
        console.debug('userStore: clearing user due to auth error')
        this.clearUser()
      }
      return null
    } finally {
      this.isFetching = false
    }
  }
}

const store = new UserStore()
export default store
