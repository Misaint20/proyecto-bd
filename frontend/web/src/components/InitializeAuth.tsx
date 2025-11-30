"use client"

import { useEffect } from 'react'
import userStore from '@/lib/userStore'

/**
 * Client component that initializes auth state once on app startup.
 * Fetches the current user from the server if a session exists.
 */
export function InitializeAuth() {
  useEffect(() => {
    // Run once on mount to restore user session if it exists
    userStore.fetchCurrentUser().catch((err) => {
      console.debug('InitializeAuth: could not fetch current user', err)
    })
  }, [])

  return null
}
