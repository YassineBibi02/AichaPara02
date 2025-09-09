'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/atoms/Button'
import { Input } from '@/components/ui/atoms/Input'
import { Upload, Download, FileText, AlertCircle } from 'lucide-react'

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return
    
    setImporting(true)
    setProgress(0)
    
    // Simulate import progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setImporting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `name,slug,description,price,discount_price,is_discount,is_feature,category_slug,image_url,stock,variation1,variation2
"Sample Product","sample-product","This is a sample product description",99.99,79.99,true,false,"skincare","https://example.com/image.jpg",50,"50ml","Cream"`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Import Products</h1>
        <p className="text-gray-600">Upload a CSV file to import multiple products at once</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">Import Instructions</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Download the CSV template to see the required format</li>
                <li>• Make sure all required fields are filled</li>
                <li>• Use existing category slugs (skincare, makeup, fragrance, etc.)</li>
                <li>• Image URLs should be publicly accessible</li>
                <li>• Price should be in TND without currency symbol</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Template */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Step 1: Download Template</h3>
          <p className="text-gray-600 mb-4">
            Download our CSV template to ensure your data is in the correct format.
          </p>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Step 2: Upload Your File</h3>
          
          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
            </div>

            {file && (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing products...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
              loading={importing}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Importing...' : 'Import Products'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {progress === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-medium">Import completed successfully!</p>
                <p className="text-green-700 text-sm">15 products imported, 2 updated, 0 errors</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}