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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
        <div>
          <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Product Catalog</h1>
          <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Manage your premium boutique inventory and SEO metadata with precision.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`flex items-center gap-3 px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl border ${showForm ? 'bg-[#1A1A1A] text-white/50 border-white/10 hover:border-premium-gold' : 'bg-premium-black text-premium-gold border-premium-gold/30 hover:bg-premium-gold hover:text-white hover:scale-105 active:scale-95'
            }`}
        >
          {showForm ? <><FiX size={16} /> Close Editor</> : <><FiPlus size={16} /> Mint New Masterpiece</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 relative">
          <div className="bg-premium-gold/5 px-10 py-6 border-b border-premium-gold/10 flex items-center justify-between">
            <h2 className="text-xl font-playfair font-black text-premium-cream tracking-wide">{editingId ? 'Edit Masterpiece' : 'Configure New Listing'}</h2>
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
                  className={`flex items-center gap-3 px-6 py-2 border font-black text-[9px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-premium-black text-premium-gold border-premium-gold/30' : 'bg-transparent text-white/30 border-transparent hover:text-white/80'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="p-10">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Masterpiece Title</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-cream focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all font-playfair text-xl italic"
                    placeholder="Signature Oud"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Narrative Description</label>
                  <textarea
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white/80 focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all text-sm font-medium"
                    rows={4}
                    placeholder="Craft a compelling narrative for this creation..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Base Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-gold font-bold focus:border-premium-gold/50 outline-none transition-all text-lg"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Category Segment</label>
                  <select
                    className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.fabric_type}
                    onChange={(e) => setFormData({ ...formData, fabric_type: e.target.value })}
                    required
                  >
                    <option value="Perfume">Premium Perfume</option>
                    <option value="Cotton">Atelier Cotton</option>
                    <option value="Silk">Imperial Silk</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Master Image Asset URL</label>
                  <input
                    type="url"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all text-sm font-mono"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">SKU / Mint Number</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono text-sm"
                    placeholder="PERF-OM-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Available Arsenal</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-bold"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Net Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all"
                    placeholder="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Package Dimensions</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm font-mono"
                    placeholder="10x5x15 cm"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 py-4 border-t border-white/10 mt-4">
                  <div className="flex items-center gap-6 bg-premium-gold/5 p-6 border border-premium-gold/20">
                    <input
                      type="checkbox"
                      id="is_visible"
                      className="w-6 h-6 accent-premium-gold cursor-pointer"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    />
                    <div>
                      <label htmlFor="is_visible" className="text-xs font-black text-premium-cream uppercase tracking-widest cursor-pointer">Published & Live</label>
                      <p className="text-[10px] text-premium-gold/70 mt-1">Activating this toggle deploys the masterpiece to the public storefront.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Signature Tone</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm"
                    placeholder="Amber / Rose"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Volume Extent</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm"
                    placeholder="100ml / Extrait"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Essence Profile</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm"
                    placeholder="Oud / Floral"
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Global Index Title</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm"
                    placeholder="Optimized index directive"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  />
                  <p className="text-[10px] text-premium-gold/40 mt-2 font-mono uppercase tracking-widest">Recommended: 50-60 chars.</p>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Index Manuscript</label>
                  <textarea
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm font-medium"
                    rows={3}
                    placeholder="Search engine narrative..."
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  />
                  <p className="text-[10px] text-premium-gold/40 mt-2 font-mono uppercase tracking-widest">Recommended: 150-160 chars.</p>
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
              <button type="submit" className="flex-1 bg-premium-black border border-premium-gold/30 text-premium-gold py-5 font-black uppercase text-[10px] tracking-widest hover:bg-premium-gold hover:text-white transition-all shadow-xl">
                {editingId ? 'Sign Masterpiece Changes' : 'Initialize to Live Catalog'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-12 bg-white/5 border border-white/10 text-white/50 py-5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all">
                  Discard Operation
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
        <div className="p-8 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 relative z-10 w-full max-w-full">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search Archives..."
              className="bg-white/5 pl-12 pr-6 py-3 border border-transparent font-medium text-xs text-white focus:border-premium-gold/50 outline-none w-64 md:w-80 transition-all placeholder-white/30"
            />
          </div>
          <div className="flex gap-4 items-center">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-4 border border-rose-500/30 bg-rose-500/5 px-4 py-2 text-rose-400 animate-in zoom-in duration-200">
                <span className="text-[9px] font-black uppercase tracking-widest">{selectedIds.length} Selected</span>
                <button
                  onClick={() => {
                    if (confirm(`Bulk delete ${selectedIds.length} elements from the archive?`)) {
                      alert('Bulk eradication processing...');
                    }
                  }}
                  className="bg-rose-600/20 text-rose-500 p-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            )}
            <button className="flex items-center gap-3 px-6 py-3 border border-white/10 font-black text-[9px] uppercase tracking-widest text-white/50 hover:bg-white/5 hover:text-white transition">
              <FiFilter /> Filter View
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em]">
                <th className="px-8 py-6 w-16">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-premium-gold cursor-pointer"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-6">Masterpiece Name</th>
                <th className="px-8 py-6">Segment</th>
                <th className="px-8 py-6">Pricing Index</th>
                <th className="px-8 py-6">Arsenal Stock</th>
                <th className="px-8 py-6 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product: any) => (
                <tr key={product.id} className={`hover:bg-premium-gold/5 transition-colors group ${selectedIds.includes(product.id) ? 'bg-premium-gold/10' : ''}`}>
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-premium-gold cursor-pointer"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 flex-shrink-0 relative overflow-hidden flex items-center justify-center text-white/20">
                        {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <FiBox size={24} />}
                      </div>
                      <div>
                        <p className="font-playfair font-black text-lg text-premium-cream group-hover:text-premium-gold transition-colors">{product.name}</p>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">ID: {product.sku || product.id?.slice(0, 8) || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-white/5 border border-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-premium-cream">{product.fabric_type || 'General'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-white text-base">₹{product.price.toLocaleString()}</p>
                    {product.discount > 0 && <p className="text-[9px] font-black tracking-widest uppercase text-premium-gold mt-1">-{product.discount}% OFF</p>}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${product.stock > 10 ? 'bg-green-400 shadow-green-400/50' : product.stock > 0 ? 'bg-yellow-400 shadow-yellow-400/50' : 'bg-rose-500 shadow-rose-500/50'}`}></span>
                      <span className="font-bold text-white/70 font-mono">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all"
                        title="Configure Metadata"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm"
                        title="Eradicate Element"
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
