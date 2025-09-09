'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/atoms/Button'
import { Input } from '@/components/ui/atoms/Input'
import { Badge } from '@/components/ui/atoms/Badge'
import { Save, Plus, Trash2, Edit } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Aicha Para',
    siteDescription: 'Premium Beauty & Cosmetics Products',
    currency: 'TND',
    freeShippingThreshold: 100,
    standardShippingFee: 8,
    taxRate: 0,
    contactEmail: 'contact@aichapara.tn',
    contactPhone: '+216 XX XXX XXX',
    address: 'Tunis, Tunisia'
  })

  const [slides, setSlides] = useState([
    {
      id: '1',
      title: 'Beauty Sale',
      subtitle: 'Up to 50% Off',
      description: 'Discover premium beauty products at unbeatable prices.',
      buttonText: 'SHOP NOW',
      buttonLink: '/store',
      imageUrl: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg',
      isActive: true
    }
  ])

  const handleSettingChange = (key: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings)
    // Here you would save to your backend
  }

  const addSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      title: 'New Slide',
      subtitle: '',
      description: '',
      buttonText: 'Shop Now',
      buttonLink: '/store',
      imageUrl: '',
      isActive: true
    }
    setSlides(prev => [...prev, newSlide])
  }

  const removeSlide = (id: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== id))
  }

  const updateSlide = (id: string, updates: any) => {
    setSlides(prev => prev.map(slide => 
      slide.id === id ? { ...slide, ...updates } : slide
    ))
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your shop settings and configuration</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
            />
            <Input
              label="Currency"
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Site Description"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Free Shipping Threshold (TND)"
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => handleSettingChange('freeShippingThreshold', parseFloat(e.target.value))}
            />
            <Input
              label="Standard Shipping Fee (TND)"
              type="number"
              value={settings.standardShippingFee}
              onChange={(e) => handleSettingChange('standardShippingFee', parseFloat(e.target.value))}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={settings.taxRate}
              onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
            />
            <Input
              label="Contact Phone"
              value={settings.contactPhone}
              onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={settings.address}
                onChange={(e) => handleSettingChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Hero Slides */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hero Slides</h2>
            <Button onClick={addSlide}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>
          
          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div key={slide.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Slide {index + 1}</h3>
                    <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSlide(slide.id, { isActive: !slide.isActive })}
                    >
                      {slide.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSlide(slide.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                  />
                  <Input
                    label="Subtitle"
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Description"
                      value={slide.description}
                      onChange={(e) => updateSlide(slide.id, { description: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Button Text"
                    value={slide.buttonText}
                    onChange={(e) => updateSlide(slide.id, { buttonText: e.target.value })}
                  />
                  <Input
                    label="Button Link"
                    value={slide.buttonLink}
                    onChange={(e) => updateSlide(slide.id, { buttonLink: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Image URL"
                      value={slide.imageUrl}
                      onChange={(e) => updateSlide(slide.id, { imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}