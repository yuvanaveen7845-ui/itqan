'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { productAPI } from '@/lib/api';
import { FiArrowLeft, FiBox, FiTrendingUp, FiSettings, FiGlobe, FiSave, FiEye, FiTrash2 } from 'react-icons/fi';
import { useNotificationStore } from '@/store/notification';

export default function AdminProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuthStore();
  const { showNotification } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount: '',
    fabric_type: 'Perfume',
    stock: '',
    image_url: '',
    sku: '',
    weight: '',
    dimensions: '',
    is_visible: true,
    meta_title: '',
    meta_description: '',
    color: '',
    size: '',
    pattern: ''
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/');
      return;
    }
    fetchProductDetails();
  }, [user, router, id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getById(id);
      
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price ? data.price.toString() : '',
        original_price: data.original_price ? data.original_price.toString() : '',
        discount: data.discount ? data.discount.toString() : '0',
        fabric_type: data.fabric_type || 'Perfume',
        stock: data.stock !== undefined ? data.stock.toString() : '',
        image_url: data.image_url || '',
        sku: data.sku || '',
        weight: data.weight ? data.weight.toString() : '',
        dimensions: data.dimensions || '',
        is_visible: data.is_visible !== false, // Default true
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        color: data.color || '',
        size: data.size || '',
        pattern: data.pattern || ''
      });
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      showNotification('Failed to fetch product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      await productAPI.update(id, payload);
      showNotification('Product updated successfully', 'luxury');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product:', error);
      showNotification('Failed to update product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productAPI.delete(id);
        showNotification('Product deleted successfully', 'info');
        router.push('/admin/products');
      } catch (error) {
        showNotification('Failed to delete product', 'error');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1200px] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition mb-4"
          >
            <FiArrowLeft /> Back to Catalog
          </button>
          <h1 className="text-4xl font-black text-gray-900 mb-2">{formData.name || 'Edit Product'}</h1>
          <p className="text-gray-500 font-medium font-mono uppercase tracking-widest text-xs">ID: {id}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/products/${id}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
          >
            <FiEye /> View Storefront
          </button>
          <button
            onClick={handleDeleteProduct}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'general', label: 'General Info', icon: <FiBox /> },
            { id: 'inventory', label: 'Stock & Shipping', icon: <FiTrendingUp /> },
            { id: 'variants', label: 'Variants & Specs', icon: <FiSettings /> },
            { id: 'seo', label: 'SEO Config', icon: <FiGlobe /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-premium-gold shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveChanges} className="p-8 md:p-12">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Product Title</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="Premium Fragrance Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Description</label>
                <textarea
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                  rows={6}
                  placeholder="Craft a compelling narrative for this product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Base Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Compare at Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Discount %</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Category</label>
                <select
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition appearance-none text-lg bg-white"
                  value={formData.fabric_type}
                  onChange={(e) => setFormData({ ...formData, fabric_type: e.target.value })}
                  required
                >
                  <option value="Perfume">Perfume</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Silk">Silk</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Master Image URL</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                  {formData.image_url && (
                    <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition font-mono text-lg"
                  placeholder="PERF-OM-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Available Stock</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="0.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Dimensions (LxWxH)</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="10x5x15 cm"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:border-premium-gold/30">
                  <input
                    type="checkbox"
                    id="is_visible"
                    className="w-6 h-6 mt-1 accent-premium-gold cursor-pointer"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  />
                  <div>
                    <label htmlFor="is_visible" className="text-xl font-black text-gray-900 cursor-pointer block mb-1">Published & Visible Online</label>
                    <p className="text-sm text-gray-500">Uncheck this to hide the product from the storefront without deleting it. It will remain accessible via direct link if you know the ID.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variants' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Primary Color</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="Amber / Rose"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Size / Volume</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="100ml / XL"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Pattern / Type</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="Concentrated / Plain"
                  value={formData.pattern}
                  onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Meta Browser Title</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  placeholder="Perfume title as it appears in search results"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                />
                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Recommended: 50-60 characters.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">Meta Description</label>
                <textarea
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition text-lg"
                  rows={4}
                  placeholder="Briefly describe the product for search engines..."
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                />
                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Recommended: 150-160 characters.</p>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-6">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-8 py-4 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 px-10 py-4 rounded-xl bg-premium-gold text-white font-black shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={20} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
