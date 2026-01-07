'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product, ProductType } from '@/types/database'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    affiliate_link: '',
    type: 'Digital' as ProductType,
    trigger_tags: '',
    image_url: '',
    active: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      affiliate_link: formData.affiliate_link,
      type: formData.type,
      trigger_tags: formData.trigger_tags.split(',').map(t => t.trim()).filter(Boolean),
      image_url: formData.image_url || null,
      active: formData.active,
    }

    if (editingProduct) {
      await supabase.from('products').update(productData as never).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(productData as never)
    }

    setShowForm(false)
    setEditingProduct(null)
    resetForm()
    fetchProducts()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      affiliate_link: product.affiliate_link,
      type: product.type as ProductType,
      trigger_tags: (product.trigger_tags || []).join(', '),
      image_url: product.image_url || '',
      active: product.active || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק את המוצר?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const toggleActive = async (product: Product) => {
    const supabase = createClient()
    await supabase.from('products').update({ active: !product.active } as never).eq('id', product.id)
    fetchProducts()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      affiliate_link: '',
      type: 'Digital',
      trigger_tags: '',
      image_url: '',
      active: true,
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-teal">ניהול מוצרים</h1>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); resetForm() }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          מוצר חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-display font-semibold text-teal mb-4">
            {editingProduct ? 'עריכת מוצר' : 'מוצר חדש'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם המוצר *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מחיר (₪) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">קישור שותפים *</label>
                <input
                  type="url"
                  required
                  value={formData.affiliate_link}
                  onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג מוצר</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                  className="input-field"
                >
                  <option value="Digital">דיגיטלי</option>
                  <option value="Physical">פיזי</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תגיות הפעלה (מופרדות בפסיק)</label>
                <input
                  type="text"
                  value={formData.trigger_tags}
                  onChange={(e) => setFormData({ ...formData, trigger_tags: e.target.value })}
                  className="input-field"
                  placeholder="תזונה, ליפדמה, דיאטה"
                />
                <p className="text-xs text-gray-500 mt-1">המוצר יוצג במאמרים עם תגיות תואמות</p>
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
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-teal"
              />
              <label htmlFor="active" className="text-sm text-gray-700">מוצר פעיל</label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingProduct ? 'עדכן' : 'צור מוצר'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingProduct(null) }}
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
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">מוצר</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">מחיר</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">סוג</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">תגיות</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">טוען...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">אין מוצרים</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 ${!product.active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sand font-semibold">₪{product.price}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {product.type === 'Digital' ? 'דיגיטלי' : 'פיזי'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(product.trigger_tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(product)} className="p-2 text-gray-500 hover:text-teal">
                        {product.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button onClick={() => handleEdit(product)} className="p-2 text-gray-500 hover:text-teal">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-500 hover:text-red-500">
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
