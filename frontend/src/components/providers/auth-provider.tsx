'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          if (session?.user) {
            await fetchUserProfile(session.user)
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        try {
          if (session?.user) {
            await fetchUserProfile(session.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          role: profile.role,
        })
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            first_name: authUser.user_metadata?.first_name,
            last_name: authUser.user_metadata?.last_name,
            phone: authUser.user_metadata?.phone,
          })
          .select()
          .single()

        if (newProfile) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
            phone: newProfile.phone,
            role: newProfile.role,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Don't set user to null here, as it might be a temporary network issue
      // Instead, create a basic user object from auth data
      setUser({
        id: authUser.id,
        email: authUser.email!,
        first_name: authUser.user_metadata?.first_name,
        last_name: authUser.user_metadata?.last_name,
        phone: authUser.user_metadata?.phone,
        role: 'client',
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setLoading(false)
        return { error: error.message }
      }
      
      // Don't set loading to false here, let the auth state change handle it
      return {}
    } catch (error) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          },
        },
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    // Don't set loading to false here, let the auth state change handle it
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'Not authenticated' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          phone: updates.phone,
        })
        .eq('id', user.id)

      if (error) {
        return { error: error.message }
      }

      // Update local user state
      setUser({ ...user, ...updates })
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}