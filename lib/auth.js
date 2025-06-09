// Auth utility for handling tokens and session management
class AuthManager {
  constructor() {
    this.refreshTimer = null
    this.isRefreshing = false
  }

  // Get tokens from localStorage
  getTokens() {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt')
      const refreshTokenExpiresAt = localStorage.getItem(
        'refreshTokenExpiresAt'
      )

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt
          ? new Date(accessTokenExpiresAt)
          : null,
        refreshTokenExpiresAt: refreshTokenExpiresAt
          ? new Date(refreshTokenExpiresAt)
          : null,
      }
    } catch (error) {
      console.error('Error getting tokens:', error)
      return {}
    }
  }

  // Store tokens in localStorage
  setTokens({
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  }) {
    try {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt)
      localStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt)

      // Set up automatic refresh
      this.scheduleTokenRefresh()
    } catch (error) {
      console.error('Error storing tokens:', error)
    }
  }

  // Clear all tokens
  clearTokens() {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessTokenExpiresAt')
      localStorage.removeItem('refreshTokenExpiresAt')
      localStorage.removeItem('token') // Remove old token if exists

      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer)
        this.refreshTimer = null
      }
    } catch (error) {
      console.error('Error clearing tokens:', error)
    }
  }

  // Check if access token is expired or expiring soon
  isAccessTokenExpired() {
    const { accessTokenExpiresAt } = this.getTokens()
    if (!accessTokenExpiresAt) return true

    // Consider token expired if it expires within the next 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)
    return accessTokenExpiresAt <= fiveMinutesFromNow
  }

  // Check if refresh token is expired
  isRefreshTokenExpired() {
    const { refreshTokenExpiresAt } = this.getTokens()
    if (!refreshTokenExpiresAt) return true

    return refreshTokenExpiresAt <= new Date()
  }

  // Refresh the access token
  async refreshAccessToken() {
    if (this.isRefreshing) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve) => {
        const checkRefresh = () => {
          if (!this.isRefreshing) {
            resolve(this.getTokens().accessToken)
          } else {
            setTimeout(checkRefresh, 100)
          }
        }
        checkRefresh()
      })
    }

    this.isRefreshing = true

    try {
      const { refreshToken } = this.getTokens()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      if (this.isRefreshTokenExpired()) {
        throw new Error('Refresh token expired')
      }

      const response = await fetch('/api/auth/session', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh token')
      }

      // Store new tokens
      this.setTokens({
        accessToken: data.session.accessToken,
        refreshToken: data.session.refreshToken,
        accessTokenExpiresAt: data.session.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.session.refreshTokenExpiresAt,
      })

      return data.session.accessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokens()
      throw error
    } finally {
      this.isRefreshing = false
    }
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken() {
    const { accessToken } = this.getTokens()

    if (!accessToken) {
      return null
    }

    if (this.isAccessTokenExpired()) {
      try {
        return await this.refreshAccessToken()
      } catch (error) {
        return null
      }
    }

    return accessToken
  }

  // Schedule automatic token refresh
  scheduleTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }

    const { accessTokenExpiresAt } = this.getTokens()
    if (!accessTokenExpiresAt) return

    // Schedule refresh 5 minutes before expiry
    const refreshTime = new Date(accessTokenExpiresAt.getTime() - 5 * 60 * 1000)
    const timeUntilRefresh = refreshTime.getTime() - Date.now()

    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshAccessToken()
        } catch (error) {
          console.error('Scheduled token refresh failed:', error)
        }
      }, timeUntilRefresh)
    }
  }

  // Make authenticated API request
  async apiRequest(url, options = {}) {
    const accessToken = await this.getValidAccessToken()

    if (!accessToken) {
      throw new Error('No valid access token')
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // If token expired, try refreshing once
    if (response.status === 401) {
      const data = await response.json()
      if (data.code === 'TOKEN_EXPIRED') {
        try {
          const newAccessToken = await this.refreshAccessToken()
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          })
        } catch (error) {
          throw new Error('Session expired')
        }
      }
    }

    return response
  }

  // Check current session
  async checkSession() {
    try {
      const response = await this.apiRequest('/api/auth/session')
      const data = await response.json()

      if (response.ok && data.success) {
        return data.user
      }
      return null
    } catch (error) {
      console.error('Session check error:', error)
      return null
    }
  }

  // Logout
  async logout() {
    try {
      await this.apiRequest('/api/auth/session', {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
    }
  }

  // Initialize auth manager (call this on app start)
  initialize() {
    // Schedule refresh if tokens exist
    const { accessToken } = this.getTokens()
    if (accessToken) {
      this.scheduleTokenRefresh()
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Page became visible, check if we need to refresh
        if (this.isAccessTokenExpired() && !this.isRefreshTokenExpired()) {
          this.refreshAccessToken().catch(console.error)
        }
      }
    })
  }
}

// Create singleton instance
const authManager = new AuthManager()

export default authManager
