'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Select } from '../atoms/Select'
import { Badge } from '../atoms/Badge'
import { LoadingSpinner } from '../atoms/LoadingSpinner'
import { Edit, Save, X, Eye, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface FormField {
  key: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'image' | 'checkbox' | 'password' | 'readonly'
  value: any
  options?: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  validation?: (value: any) => string | null
  confirmationRequired?: boolean // For sensitive fields like role changes
}

export interface UniversalFormProps {
  title: string
  fields: FormField[]
  mode: 'view' | 'edit'
  loading?: boolean
  onModeChange: (mode: 'view' | 'edit') => void
  onSave: (data: Record<string, any>, changes: Record<string, any>) => Promise<void>
  onCancel?: () => void
  className?: string
  showImagePreview?: boolean
}

export function UniversalForm({
  title,
  fields,
  mode,
  loading = false,
  onModeChange,
  onSave,
  onCancel,
  className,
  showImagePreview = true
}: UniversalFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [originalData, setOriginalData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [changes, setChanges] = useState<Record<string, any>>({})
  const [confirmationFields, setConfirmationFields] = useState<Record<string, string>>({})

  useEffect(() => {
    const initialData = fields.reduce((acc, field) => {
      acc[field.key] = field.value
      return acc
    }, {} as Record<string, any>)
    
    setFormData(initialData)
    setOriginalData(initialData)
  }, [fields])

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`
      }
      
      if (field.validation && formData[field.key]) {
        const error = field.validation(formData[field.key])
        if (error) {
          newErrors[field.key] = error
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getChanges = () => {
    const changes: Record<string, any> = {}
    
    fields.forEach(field => {
      if (formData[field.key] !== originalData[field.key]) {
        changes[field.key] = {
          from: originalData[field.key],
          to: formData[field.key],
          label: field.label
        }
      }
    })
    
    return changes
  }

  const handleSave = () => {
    if (!validateForm()) return
    
    const detectedChanges = getChanges()
    
    if (Object.keys(detectedChanges).length === 0) {
      onModeChange('view')
      return
    }
    
    // Check if any field requires confirmation
    const requiresConfirmation = fields.some(field => 
      field.confirmationRequired && detectedChanges[field.key]
    )
    
    if (requiresConfirmation) {
      setChanges(detectedChanges)
      setShowConfirmation(true)
    } else {
      onSave(formData, detectedChanges)
    }
  }

  const handleConfirmedSave = () => {
    // Validate confirmation fields
    const confirmationErrors: Record<string, string> = {}
    
    Object.keys(changes).forEach(key => {
      const field = fields.find(f => f.key === key)
      if (field?.confirmationRequired) {
        const confirmValue = confirmationFields[key]
        const newValue = changes[key].to
        
        if (confirmValue !== newValue) {
          confirmationErrors[key] = `Please re-enter the new ${field.label.toLowerCase()} to confirm`
        }
      }
    })
    
    if (Object.keys(confirmationErrors).length > 0) {
      setErrors(confirmationErrors)
      return
    }
    
    onSave(formData, changes)
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    setFormData(originalData)
    setErrors({})
    setShowConfirmation(false)
    setConfirmationFields({})
    onModeChange('view')
    onCancel?.()
  }

  const renderField = (field: FormField) => {
    const value = formData[field.key] || ''
    const error = errors[field.key]
    
    if (mode === 'view' && field.type !== 'image') {
      return (
        <div key={field.key} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="text-sm text-gray-900 py-2">
            {field.type === 'select' 
              ? field.options?.find(opt => opt.value === value)?.label || value
              : field.type === 'checkbox'
              ? value ? 'Yes' : 'No'
              : value || '-'
            }
          </div>
        </div>
      )
    }
    
    switch (field.type) {
      case 'image':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {value && showImagePreview ? (
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={value}
                  alt={field.label}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
            {mode === 'edit' && (
              <Input
                type="url"
                value={value}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder || 'Enter image URL'}
                error={error}
                disabled={field.disabled}
              />
            )}
          </div>
        )
        
      case 'select':
        return (
          <div key={field.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              options={field.options || []}
              value={value}
              onChange={(val) => handleFieldChange(field.key, val)}
              placeholder={field.placeholder}
              disabled={field.disabled}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )
        
      case 'textarea':
        return (
          <div key={field.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              rows={4}
              className={cn(
                'block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )
        
      case 'checkbox':
        return (
          <div key={field.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              disabled={field.disabled}
              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        )
        
      case 'readonly':
        return (
          <div key={field.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <div className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
              {value || '-'}
            </div>
          </div>
        )
        
      default:
        return (
          <Input
            key={field.key}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
    }
  }

  if (showConfirmation) {
    return (
      <div className={cn('bg-white rounded-lg border p-6', className)}>
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Confirm Changes</h3>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-sm text-gray-600">
            Please review and confirm the following changes:
          </p>
          
          {Object.entries(changes).map(([key, change]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">{change.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">From:</span>
                  <div className="font-medium text-red-600">{change.from || 'Empty'}</div>
                </div>
                <div>
                  <span className="text-gray-500">To:</span>
                  <div className="font-medium text-green-600">{change.to || 'Empty'}</div>
                </div>
              </div>
              
              {fields.find(f => f.key === key)?.confirmationRequired && (
                <div className="mt-3">
                  <Input
                    label={`Re-enter new ${change.label.toLowerCase()} to confirm`}
                    value={confirmationFields[key] || ''}
                    onChange={(e) => setConfirmationFields(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={`Type "${change.to}" to confirm`}
                    error={errors[key]}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={handleConfirmedSave} loading={loading}>
            <Save className="h-4 w-4 mr-2" />
            Confirm & Save
          </Button>
          <Button variant="outline" onClick={() => setShowConfirmation(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg border p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          {mode === 'view' ? (
            <Button onClick={() => onModeChange('edit')} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(renderField)}
      </div>
    </div>
  )
}