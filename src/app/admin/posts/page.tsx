'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Post, PostCategory } from '@/types/database'

const categoryLabels = {
  Nutrition: 'תזונה',
  Treatment: 'טיפולים',
  Success: 'סיפורי הצלחה',
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Nutrition' as PostCategory,
    image_url: '',
    tags: '',
    slug: '',
    published: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setPosts(data)
    setLoading(false)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s\u0590-\u05FF]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 150),
      category: formData.category,
      image_url: formData.image_url || null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      slug: formData.slug || generateSlug(formData.title),
      published: formData.published,
      date: new Date().toISOString().split('T')[0],
    }

    if (editingPost) {
      await supabase.from('posts').update(postData as never).eq('id', editingPost.id)
    } else {
      await supabase.from('posts').insert(postData as never)
    }

    setShowForm(false)
    setEditingPost(null)
    resetForm()
    fetchPosts()
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category as PostCategory,
      image_url: post.image_url || '',
      tags: (post.tags || []).join(', '),
      slug: post.slug,
      published: post.published || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק את המאמר?')) return
    const supabase = createClient()
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  const togglePublish = async (post: Post) => {
    const supabase = createClient()
    await supabase.from('posts').update({ published: !post.published } as never).eq('id', post.id)
    fetchPosts()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'Nutrition',
      image_url: '',
      tags: '',
      slug: '',
      published: false,
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-teal">ניהול מאמרים</h1>
        <button
          onClick={() => { setShowForm(true); setEditingPost(null); resetForm() }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          מאמר חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-display font-semibold text-teal mb-4">
            {editingPost ? 'עריכת מאמר' : 'מאמר חדש'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input-field"
                  placeholder="יווצר אוטומטית"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תקציר</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תוכן *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field"
                rows={8}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as PostCategory })}
                  className="input-field"
                >
                  <option value="Nutrition">תזונה</option>
                  <option value="Treatment">טיפולים</option>
                  <option value="Success">סיפורי הצלחה</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תגיות (מופרדות בפסיק)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field"
                  placeholder="תזונה, ליפדמה, טיפים"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">קישור לתמונה</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-teal"
              />
              <label htmlFor="published" className="text-sm text-gray-700">פרסם מאמר</label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingPost ? 'עדכן' : 'צור מאמר'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingPost(null) }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">כותרת</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">קטגוריה</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">סטטוס</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">טוען...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">אין מאמרים</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-sand bg-sand/10 px-2 py-1 rounded">
                      {categoryLabels[post.category as keyof typeof categoryLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`flex items-center gap-1 text-sm ${post.published ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {post.published ? 'מפורסם' : 'טיוטה'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(post)} className="p-2 text-gray-500 hover:text-teal">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
