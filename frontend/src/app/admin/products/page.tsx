'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { productAPI } from '@/lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiSearch, FiFilter, FiChevronRight, FiBox, FiTrendingUp, FiSettings, FiGlobe } from 'react-icons/fi';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    fetchProducts();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll({ limit: 100 });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      if (editingId) {
        await productAPI.update(editingId, payload);
      } else {
        await productAPI.create(payload);
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      alert(`Failed to ${editingId ? 'update' : 'add'} product`);
    }
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: (product.original_price || '').toString(),
      discount: (product.discount || '0').toString(),
      fabric_type: product.fabric_type || 'Perfume',
      stock: product.stock.toString(),
      image_url: product.image_url || '',
      sku: product.sku || '',
      weight: (product.weight || '').toString(),
      dimensions: product.dimensions || '',
      is_visible: product.is_visible !== false,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      color: product.color || '',
      size: product.size || '',
      pattern: product.pattern || ''
    });
    setShowForm(true);
    setActiveTab('general');
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', description: '', price: '', original_price: '', discount: '',
      fabric_type: 'Perfume', stock: '', image_url: '', sku: '', weight: '',
      dimensions: '', is_visible: true, meta_title: '', meta_description: '',
      color: '', size: '', pattern: ''
    });
    setShowForm(false);
    setActiveTab('general');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.length === products.length ? [] : products.map((p: any) => p.id)
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 font-medium">Manage your premium boutique inventory and SEO metadata with precision.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl ${showForm ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-premium-gold text-white shadow-blue-200 hover:bg-premium-black hover:scale-105 active:scale-95'
            }`}
        >
          {showForm ? <><FiX size={20} /> Close Editor</> : <><FiPlus size={20} /> Create New Product</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-800">{editingId ? 'Edit Performance Product' : 'Configure New Listing'}</h2>
            <div className="flex gap-2">
              {[
                { id: 'general', label: 'General', icon: <FiBox /> },
                { id: 'inventory', label: 'Stock & Shipping', icon: <FiTrendingUp /> },
                { id: 'variants', label: 'Variants', icon: <FiSettings /> },
                { id: 'seo', label: 'SEO Config', icon: <FiGlobe /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab === tab.id ? 'bg-white text-premium-gold shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="p-8">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Product Title</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="Premium Fragrance Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Description</label>
                  <textarea
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    rows={4}
                    placeholder="Craft a compelling narrative for this product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Base Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Category</label>
                  <select
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition appearance-none"
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Master Image URL</label>
                  <input
                    type="url"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition font-mono"
                    placeholder="PERF-OM-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Available Stock</label>
                  <input
                    type="number"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Dimensions (LxWxH)</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="10x5x15 cm"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 py-4">
                  <div className="flex items-center gap-4 bg-premium-cream p-4 rounded-xl border border-blue-100">
                    <input
                      type="checkbox"
                      id="is_visible"
                      className="w-5 h-5 accent-premium-gold"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    />
                    <div>
                      <label htmlFor="is_visible" className="font-bold text-gray-900 cursor-pointer">Published & Visible</label>
                      <p className="text-xs text-premium-gold">Product will be visible to all customers in the shop front.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Primary Color</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="Amber / Rose"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Size / Volume</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="100ml / XL"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Pattern / Type</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="Concentrated / Plain"
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Meta Browser Title</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    placeholder="Perfume title as it appears in search results"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Recommended: 50-60 characters.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Meta Description</label>
                  <textarea
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-premium-cream outline-none transition"
                    rows={3}
                    placeholder="Briefly describe the product for search engines..."
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Recommended: 150-160 characters.</p>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
              <button type="submit" className="flex-1 bg-premium-gold text-white py-4 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-premium-black transition">
                {editingId ? 'Save Application Changes' : 'Initialize Product Listing'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-10 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by SKU or ID..."
              className="bg-gray-50 pl-12 pr-6 py-2.5 rounded-xl border-none font-medium text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
            />
          </div>
          <div className="flex gap-2 items-center">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 mr-4 bg-red-50 px-4 py-2 rounded-xl text-red-600 animate-in zoom-in duration-200">
                <span className="text-xs font-black uppercase">{selectedIds.length} Selected</span>
                <button
                  onClick={() => {
                    if (confirm(`Bulk delete ${selectedIds.length} items?`)) {
                      alert('Bulk actions processing...');
                    }
                  }}
                  className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            )}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition">
              <FiFilter /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-premium-gold rounded"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-5">Product</th>
                <th className="px-8 py-5">Fragrance/Type</th>
                <th className="px-8 py-5">Pricing</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product: any) => (
                <tr key={product.id} className={`hover:bg-premium-cream/30 transition-colors ${selectedIds.includes(product.id) ? 'bg-premium-cream/50' : ''}`}>
                  <td className="px-8 py-5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-premium-gold rounded"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center text-gray-400">
                        {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <FiBox size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-premium-gold transition-colors">{product.name}</p>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{product.sku || product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">{product.fabric_type || 'General'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-gray-900">₹{product.price.toLocaleString()}</p>
                    {product.discount > 0 && <p className="text-[10px] text-green-600 font-bold">-{product.discount}% OFF</p>}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      <span className="font-bold text-gray-700">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-premium-gold hover:text-white transition shadow-sm"
                        title="Quick Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                        title="Delete Product"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
