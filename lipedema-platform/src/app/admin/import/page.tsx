'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { parseInstagramExport, importPosts, ImportResult, ImportError } from '@/lib/import/contentImporter'

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [errors, setErrors] = useState<ImportError[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile)
      setImportResult(null)
      setErrors([])
    } else {
      alert('אנא בחר קובץ JSON תקין')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsUploading(true)
    setImportResult(null)
    setErrors([])

    try {
      // Read file content
      const fileContent = await file.text()
      
      // Parse Instagram export
      const posts = parseInstagramExport(fileContent)
      
      if (!posts) {
        setErrors([{
          postId: 'parse',
          reason: 'שגיאה בפענוח הקובץ - וודא שהקובץ בפורמט JSON תקין'
        }])
        setIsUploading(false)
        return
      }

      // Import posts
      const result = await importPosts(posts)
      setImportResult(result)
      
      if (result.errors.length > 0) {
        setErrors(result.errors)
      }
    } catch (error) {
      setErrors([{
        postId: 'general',
        reason: `שגיאה כללית: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`
      }])
    } finally {
      setIsUploading(false)
    }
  }

  const resetImport = () => {
    setFile(null)
    setImportResult(null)
    setErrors([])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          ייבוא תוכן מאינסטגרם
        </h1>
        <p className="text-gray-600">
          העלה קובץ JSON של ייצוא אינסטגרם כדי לייבא פוסטים למערכת
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          העלאת קובץ
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              בחר קובץ JSON
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal file:text-white hover:file:bg-teal/90"
            />
          </div>
          
          {file && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={!file || isUploading}
              className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  מייבא...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  התחל ייבוא
                </>
              )}
            </button>
            
            {(file || importResult) && (
              <button
                onClick={resetImport}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                איפוס
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            תוצאות ייבוא
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                <div className="text-sm text-green-700">פוסטים יובאו</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{importResult.skipped}</div>
                <div className="text-sm text-yellow-700">פוסטים קיימים (דולגו)</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                <div className="text-sm text-red-700">שגיאות</div>
              </div>
            </div>
          </div>
          
          {importResult.success ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>הייבוא הושלם בהצלחה! הפוסטים נשמרו כטיוטות ומחכים לאישור.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span>הייבוא נכשל. בדוק את השגיאות למטה.</span>
            </div>
          )}
        </div>
      )}

      {/* Error Details */}
      {errors.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            שגיאות ייבוא
          </h2>
          
          <div className="space-y-3">
            {errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-red-900">
                  פוסט ID: {error.postId}
                </div>
                <div className="text-red-700 text-sm mt-1">
                  {error.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          הוראות שימוש
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• הקובץ חייב להיות בפורמט JSON תקין</li>
          <li>• כל פוסט חייב לכלול: id, title, content, image_url, date, category_slug, monetization_strategy, original_url</li>
          <li>• פוסטים קיימים (לפי original_url) יידלגו אוטומטית</li>
          <li>• פוסטים חדשים יישמרו כטיוטות ויחכו לאישור בעמוד ניהול המאמרים</li>
          <li>• אם יש שגיאות, בדוק את פורמט הנתונים בקובץ JSON</li>
        </ul>
      </div>
    </div>
  )
}