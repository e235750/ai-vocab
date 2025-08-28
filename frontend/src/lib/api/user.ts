'use server'
import { UserSettings, UserProfile } from '@/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// ユーザー設定取得
export async function getUserSettings(
  token: string
): Promise<UserSettings | { error: string }> {
  if (!token) {
    return { error: 'User authentication token is required' }
  }
  const url = `${API_BASE_URL}/user-settings/me/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[getUserSettings] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to fetch user settings'
      console.error('[getUserSettings] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[getUserSettings] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[getUserSettings] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

// ユーザー設定更新
export async function updateUserSettings(
  token: string,
  settings: Partial<UserSettings>
): Promise<UserSettings | { error: string }> {
  if (!token) {
    return { error: 'User authentication token is required' }
  }
  const url = `${API_BASE_URL}/user-settings/me/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings),
    })
    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[updateUserSettings] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to update user settings'
      console.error('[updateUserSettings] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[updateUserSettings] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[updateUserSettings] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

// ユーザープロフィール取得
export async function getUserProfile(
  token: string
): Promise<UserProfile | { error: string }> {
  if (!token) {
    return { error: 'User authentication token is required' }
  }
  const url = `${API_BASE_URL}/users/me/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[getUserProfile] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to fetch user profile'
      console.error('[getUserProfile] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[getUserProfile] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[getUserProfile] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

// ユーザープロフィール更新
export async function updateUserProfile(
  token: string,
  profile: Partial<UserProfile>
): Promise<UserProfile | { error: string }> {
  if (!token) {
    return { error: 'User authentication token is required' }
  }
  const url = `${API_BASE_URL}/users/me/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profile),
    })
    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[updateUserProfile] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to update user profile'
      console.error('[updateUserProfile] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[updateUserProfile] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[updateUserProfile] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}
