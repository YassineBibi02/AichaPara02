'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { UniversalForm, FormField } from '@/components/ui/organisms/UniversalForm'
import { Button } from '@/components/ui/atoms/Button'
import { ArrowLeft } from 'lucide-react'
import { User } from '@/lib/types'

export default function UserViewPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      // Mock data - replace with actual API call
      const mockUser: User = {
        id: params.id as string,
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+216 12 345 678',
        role: 'client'
      }
      setUser(mockUser)
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: Record<string, any>, changes: Record<string, any>) => {
    setSaving(true)
    try {
      // Mock API call - replace with actual implementation
      console.log('Saving user:', data, changes)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser(prev => prev ? { ...prev, ...data } : null)
      setMode('view')
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const fields: FormField[] = [
    {
      key: 'first_name',
      label: 'First Name',
      type: 'readonly',
      value: user.first_name
    },
    {
      key: 'last_name',
      label: 'Last Name',
      type: 'readonly',
      value: user.last_name
    },
    {
      key: 'email',
      label: 'Email',
      type: 'readonly',
      value: user.email
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'readonly',
      value: user.phone
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      value: user.role,
      options: [
        { value: 'client', label: 'Client' },
        { value: 'admin', label: 'Admin' },
        { value: 'superadmin', label: 'Super Admin' }
      ],
      required: true,
      confirmationRequired: true,
      validation: (value) => {
        if (!['client', 'admin', 'superadmin'].includes(value)) {
          return 'Invalid role selected'
        }
        return null
      }
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <UniversalForm
        title={`User: ${user.first_name} ${user.last_name}`}
        fields={fields}
        mode={mode}
        loading={saving}
        onModeChange={setMode}
        onSave={handleSave}
        showImagePreview={false}
      />
    </div>
  )
}