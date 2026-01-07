'use client'

import { useEffect, useState } from 'react'
import { Download, Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { WaitlistEntry } from '@/types/database'

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    const supabase = createClient()
    const { data } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setEntries(data)
    setLoading(false)
  }

  const exportToCSV = () => {
    const headers = ['שם', 'אימייל', 'טלפון', 'טיפולים מעניינים', 'תאריך הרשמה']
    const rows = entries.map(e => [
      e.name,
      e.email,
      e.phone || '',
      (e.treatment_interest || []).join('; '),
      new Date(e.created_at || '').toLocaleDateString('he-IL'),
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `waitlist_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-teal">רשימת המתנה</h1>
        <button
          onClick={exportToCSV}
          disabled={entries.length === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          ייצוא CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">שם</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">פרטי קשר</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">טיפולים מעניינים</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">תשובות לשאלון</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">תאריך</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">טוען...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">אין נרשמים עדיין</td></tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{entry.name}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <a href={`mailto:${entry.email}`} className="flex items-center gap-2 text-sm text-teal hover:underline">
                        <Mail className="w-4 h-4" />
                        {entry.email}
                      </a>
                      {entry.phone && (
                        <a href={`tel:${entry.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:underline">
                          <Phone className="w-4 h-4" />
                          {entry.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(entry.treatment_interest || []).map((t) => (
                        <span key={t} className="text-xs bg-teal/10 text-teal px-2 py-1 rounded">
                          {t === 'sauna' ? 'סאונה' : t === 'vibration' ? 'פלטפורמת רטט' : t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 space-y-1">
                      {Object.entries(entry.quiz_answers || {}).map(([q, a]) => (
                        <div key={q}><strong>{q}:</strong> {String(a)}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(entry.created_at || '').toLocaleDateString('he-IL')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
