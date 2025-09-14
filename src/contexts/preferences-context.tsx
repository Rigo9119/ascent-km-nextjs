'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createSbBrowserClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { PreferencesService } from '@/services/preferences-service'
import { UserPreferences, defaultPreferences, Notifications, Privacy, UserPreferencesUpdate } from '@/types/preferences'

interface PreferencesContextType {
  preferences: UserPreferences
  isLoading: boolean
  error: string | null
  updateTheme: (theme: UserPreferences['theme']) => Promise<boolean>
  updateNotification: (key: keyof UserPreferences['notifications'], value: boolean) => Promise<boolean>
  updatePrivacySetting: (key: keyof UserPreferences['privacy'], value: UserPreferences['privacy'][keyof UserPreferences['privacy']]) => Promise<boolean>
  updateLanguage: (language: UserPreferences['language']) => Promise<boolean>
  updatePreferences: (preferences: UserPreferencesUpdate) => Promise<boolean>
  refreshPreferences: () => Promise<void>
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSbBrowserClient()
  const preferencesService = new PreferencesService(supabase)

  // Load preferences when user changes
  useEffect(() => {
    if (user) {
      loadPreferences()
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalPreferences()
    }
  }, [user])

  const loadPreferences = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const userPrefs = await preferencesService.getUserPreferences(user.id)
      setPreferences(userPrefs)

      // Also save to localStorage for offline access
      localStorage.setItem('user-preferences', JSON.stringify(userPrefs))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load preferences'
      setError(errorMessage)
      console.error('Error loading preferences:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadLocalPreferences = () => {
    try {
      const stored = localStorage.getItem('user-preferences')
      if (stored) {
        const parsedPrefs = JSON.parse(stored)
        setPreferences({ ...defaultPreferences, ...parsedPrefs })
      }
    } catch (err) {
      console.error('Error loading local preferences:', err)
      setPreferences(defaultPreferences)
    }
  }

  const updateLocalPreferences = (newPrefs: UserPreferences) => {
    localStorage.setItem('user-preferences', JSON.stringify(newPrefs))
    setPreferences(newPrefs)
  }

  const updatePreferences = async (updates: UserPreferencesUpdate): Promise<boolean> => {
    const newPreferences: UserPreferences = {
      ...preferences,
      ...updates,
      // Handle nested objects properly
      notifications: {
        ...preferences.notifications,
        ...updates.notifications
      },
      privacy: {
        ...preferences.privacy,
        ...updates.privacy
      }
    }

    // Update local state immediately for better UX
    setPreferences(newPreferences)
    updateLocalPreferences(newPreferences)

    // Update in Supabase if user is logged in
    if (user) {
      try {
        const result = await preferencesService.updateUserPreferences(user.id, updates)
        if (!result.success) {
          setError(result.error || 'Failed to update preferences')
          return false
        }
        setError(null)
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences'
        setError(errorMessage)
        return false
      }
    }

    return true // Success for non-authenticated users (localStorage only)
  }

  const updateTheme = async (theme: UserPreferences['theme']): Promise<boolean> => {
    return updatePreferences({ theme })
  }

  const updateNotification = async (
    key: keyof UserPreferences['notifications'],
    value: boolean
  ): Promise<boolean> => {
    return updatePreferences({
      notifications: { [key]: value }
    })
  }

  const updatePrivacySetting = async (
    key: keyof UserPreferences['privacy'],
    value: UserPreferences['privacy'][keyof UserPreferences['privacy']]
  ): Promise<boolean> => {
    return updatePreferences({
      privacy: { [key]: value }
    })
  }

  const updateLanguage = async (language: UserPreferences['language']): Promise<boolean> => {
    return updatePreferences({ language })
  }

  const refreshPreferences = async () => {
    if (user) {
      await loadPreferences()
    }
  }

  const value: PreferencesContextType = {
    preferences,
    isLoading,
    error,
    updateTheme,
    updateNotification,
    updatePrivacySetting,
    updateLanguage,
    updatePreferences,
    refreshPreferences
  }

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
