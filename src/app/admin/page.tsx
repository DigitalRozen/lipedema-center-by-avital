'use client'

import { useEffect, useState } from 'react'
import { FileText, Package, Users, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  posts: number
  products: number
  waitlist: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, products: 0, waitlist: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      const [postsRes, productsRes, waitlistRes] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('waitlist').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        posts: postsRes.count || 0,
        products: productsRes.count || 0,
        waitlist: waitlistRes.count || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'מאמרים', value: stats.posts, icon: FileText, color: 'bg-teal' },
    { label: 'מוצרים', value: stats.products, icon: Package, color: 'bg-sand' },
    { label: 'רשימת המתנה', value: stats.waitlist, icon: Users, color: 'bg-pink-400' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-teal mb-8">דשבורד</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-teal" />
          <h2 className="text-xl font-display font-semibold text-teal">פעולות מהירות</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/admin/posts" className="p-4 border border-gray-200 rounded-lg hover:border-teal hover:bg-teal/5 transition-colors">
            <h3 className="font-medium text-gray-800">הוסף מאמר חדש</h3>
            <p className="text-sm text-gray-500">צור תוכן חדש למרכז הידע</p>
          </a>
          <a href="/admin/products" className="p-4 border border-gray-200 rounded-lg hover:border-teal hover:bg-teal/5 transition-colors">
            <h3 className="font-medium text-gray-800">הוסף מוצר</h3>
            <p className="text-sm text-gray-500">הוסף מוצר חדש למנוע ההמלצות</p>
          </a>
          <a href="/admin/import" className="p-4 border border-gray-200 rounded-lg hover:border-teal hover:bg-teal/5 transition-colors">
            <h3 className="font-medium text-gray-800">ייבוא JSON</h3>
            <p className="text-sm text-gray-500">ייבא מאמרים מקובץ JSON</p>
          </a>
          <a href="/admin/waitlist" className="p-4 border border-gray-200 rounded-lg hover:border-teal hover:bg-teal/5 transition-colors">
            <h3 className="font-medium text-gray-800">צפה ברשימת ההמתנה</h3>
            <p className="text-sm text-gray-500">נהל את הלידים שנרשמו</p>
          </a>
        </div>
      </div>
    </div>
  )
}
