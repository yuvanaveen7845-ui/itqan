'use client';

import { useEffect, useState } from 'react';
import { adminAPI, productAPI } from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiPackage, FiX, FiDownload } from 'react-icons/fi';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount: '',
    Fragrance_type: 'Cotton',
    stock: '',
    image_url: '',
    images: [''],
    color: '',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getInventory();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Price', 'Stock', 'Status'];
    const rows = products.map(p => [
      p.id,
      p.name,
      p.sku || 'N/A',
      p.price,
      p.stock,
      p.stock <= 5 ? 'Critical' : p.stock <= 10 ? 'Low' : 'Healthy'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bulkReplenish = async () => {
    const amount = prompt("Enter specific quantity to replenish ALL critically low assets (Stock <= 10):");
    if (!amount || isNaN(parseInt(amount))) return;

    const lowStockItems = products.filter(p => p.stock <= 10);
    if (lowStockItems.length === 0) {
      alert("No critical inventory flags detected.");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(lowStockItems.map(p =>
        productAPI.update(p.id, { stock: p.stock + parseInt(amount) })
      ));
      alert(`Successfully replenished ${lowStockItems.length} assets.`);
      fetchInventory();
    } catch (error) {
      alert("Failed to execute bulk logistics operation.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        original_price: (product.original_price || '').toString(),
        discount: (product.discount || '').toString(),
        Fragrance_type: product.Fragrance_type || 'Cotton',
        stock: product.stock.toString(),
        image_url: product.image_url || '',
        images: product.images && product.images.length > 0 ? product.images : [''],
        color: product.color || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        discount: '',
        Fragrance_type: 'Cotton',
        stock: '',
        image_url: '',
        images: [''],
        color: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: formData.discount ? parseInt(formData.discount) : 0,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== ''),
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, payload);
      } else {
        await productAPI.create(payload);
      }
      fetchInventory();
      setShowModal(false);
    } catch (error: any) {
      console.error('Save error details:', error.response?.data);
      alert('Failed to authorize asset update');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Eradicate this asset from the inventory manifest?')) {
      try {
        await productAPI.delete(id);
        setProducts(products.filter((p: any) => p.id !== id));
      } catch (error) {
        alert('Failed to eradicate asset');
      }
    }
  };

  const lowStockCount = products.filter(p => p.stock <= 10).length;

  return (
    <>
      <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
          <div>
            <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Logistics Command Center</h1>
            <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Omniscient view of global repository limits and asset velocity.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest shadow-sm"
            >
              <FiDownload size={16} /> Mint CSV Ledger
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-3 px-8 py-4 bg-premium-black text-premium-gold border border-premium-gold/30 hover:bg-premium-gold hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95"
            >
              <FiPlus size={16} /> Instantiate Asset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className={`p-8 rounded-none border border-white/5 relative overflow-hidden transition-all flex items-center gap-8 ${lowStockCount > 0 ? 'bg-rose-500/5 shadow-[0_0_30px_rgba(244,63,94,0.1)]' : 'bg-[#1A1A1A]'}`}>
            {lowStockCount > 0 && <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-50 pointer-events-none"></div>}
            <div className={`p-5 rounded-none flex items-center justify-center border shadow-inner relative z-10 ${lowStockCount > 0 ? 'bg-rose-500/20 text-rose-500 border-rose-500/50' : 'bg-white/5 text-white/30 border-white/10'}`}>
              <FiAlertCircle size={32} />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">Critical Telemetry</p>
              <h3 className={`text-4xl font-playfair font-black tracking-tight ${lowStockCount > 0 ? 'text-rose-500' : 'text-white'}`}>{lowStockCount} Flags</h3>
              {lowStockCount > 0 && (
                <button onClick={bulkReplenish} className="text-[9px] font-black uppercase text-rose-400 hover:text-white tracking-widest mt-3 underline underline-offset-4 transition-colors">Authorize Global Restock</button>
              )}
            </div>
          </div>

          <div className="p-8 bg-[#1A1A1A] border border-white/5 relative overflow-hidden flex items-center gap-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/5 pointer-events-none"></div>
            <div className="p-5 bg-premium-gold/10 text-premium-gold border border-premium-gold/30 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <FiPackage size={32} />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Active Reservoir</p>
              <h3 className="text-4xl font-playfair font-black text-premium-cream tracking-tight">{products.length} Units</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
          {loading ? (
            <div className="p-20 text-center relative z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/40 text-premium-gold/60 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="px-10 py-6">Physical Asset</th>
                    <th className="px-10 py-6 text-center">Valuation Index</th>
                    <th className="px-10 py-6">Arsenal Depth</th>
                    <th className="px-10 py-6">State Matrix</th>
                    <th className="px-10 py-6 text-right">Overrides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product: any) => (
                    <tr key={product.id} className="group hover:bg-premium-gold/5 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-white/20 group-hover:border-premium-gold/50 transition-all overflow-hidden shadow-inner">
                              {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <FiPackage size={24} />}
                            </div>
                            {product.stock <= 5 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse"></div>}
                          </div>
                          <div>
                            <p className="font-playfair font-black text-lg text-premium-cream group-hover:text-premium-gold transition-colors tracking-wide">{product.name}</p>
                            <p className="text-[10px] text-white/40 font-mono tracking-widest mt-1 uppercase">ID: {product.sku || product.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="font-black text-white text-base">₹{Number(product.price).toLocaleString()}</span>
                        {product.discount > 0 && <span className="block text-[9px] font-black tracking-widest text-premium-gold uppercase mt-1">-{product.discount}% Discount</span>}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col gap-3">
                          <div className="w-full h-1 bg-white/10 overflow-hidden">
                            <div className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)] ${product.stock > 50 ? 'bg-green-400' : product.stock > 10 ? 'bg-premium-gold' : 'bg-rose-500'}`} style={{ width: `${Math.min(product.stock, 100)}%` }}></div>
                          </div>
                          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${product.stock <= 10 ? 'text-rose-400' : 'text-white/50'}`}>
                            {product.stock} Units
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border inline-block ${product.stock > 10 ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                          product.stock > 0 ? 'bg-premium-gold/10 text-premium-gold border-premium-gold/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                          }`}>
                          {product.stock > 10 ? 'Optimal' : product.stock > 0 ? 'Depleting' : 'Void'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all shadow-sm"
                            title="Reconfigure Asset"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm"
                            title="Purge Vector"
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
          )}
        </div>
      </div>

      {/* Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-premium-gold/30 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(234,179,8,0.1)] animate-in zoom-in-95 duration-300">
             <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#1A1A1A]/90 backdrop-blur-md z-10">
              <h2 className="text-2xl font-playfair font-black text-premium-cream tracking-wide">{editingProduct ? 'Recalibrate Asset Parameters' : 'Authorize New Intel Array'}</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-white/5 hover:bg-premium-gold hover:text-white border border-white/10 text-white/50 flex items-center justify-center transition-all"><FiX size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Signature Tag</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-cream focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all font-playfair text-xl italic"
                    placeholder="e.g. Ivory Silk Extraction"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Material Narrative</label>
                  <textarea
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white/80 focus:border-premium-gold/50 outline-none transition-all text-sm font-medium"
                    rows={3}
                    placeholder="Physical composition details and aesthetic vision..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Market Valuation (₹)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-gold focus:border-premium-gold/50 outline-none transition-all font-black text-lg"
                    placeholder="Live indexing price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Historical Anchor (₹)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono"
                    placeholder="Pre-reduction marker"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Reduction Percentage (%)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono text-sm"
                    placeholder="e.g. 15 for 15% drop"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Authorized Units</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-mono font-bold"
                    placeholder="Genesis depth"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Botanical Sector</label>
                  <select
                    className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                    value={formData.Fragrance_type}
                    onChange={(e) => setFormData({ ...formData, Fragrance_type: e.target.value })}
                  >
                    <option value="Cotton">Atelier Cotton</option>
                    <option value="Silk">Imperial Silk</option>
                    <option value="Linen">Raw Linen</option>
                    <option value="Wool">Winter Wool</option>
                    <option value="Perfume">Liquid Gold (Perfume)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Chromatic Shade</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm"
                    placeholder="e.g. Obsidian Black"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5">
                    <label className="block text-[9px] font-black text-white/50 uppercase tracking-widest">Visual Data Array</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                      className="text-[9px] font-black uppercase text-premium-gold tracking-widest hover:text-white flex items-center gap-2 transition-colors border border-premium-gold/30 px-3 py-1.5"
                    >
                      <FiPlus size={12} /> Bind Node
                    </button>
                  </div>
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="url"
                        className="flex-grow px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm font-mono"
                        placeholder="https://assets.network/image.jpg"
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="px-6 bg-white/5 border border-white/10 text-white/30 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="bg-premium-gold/5 p-4 border-l-2 border-premium-gold">
                    <p className="text-[10px] text-premium-gold/70 font-mono tracking-wide uppercase">Provide robust URLs for global content distribution. Index 0 delegates to the primary canvas.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex gap-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-6 bg-premium-black border border-premium-gold/30 text-premium-gold font-black uppercase text-[10px] tracking-widest hover:bg-premium-gold hover:text-white transition-all shadow-[0_0_20px_rgba(234,179,8,0.15)] disabled:opacity-50"
                  >
                    {formLoading ? 'Applying Modifications...' : editingProduct ? 'Commit Configuration' : 'Initialize Physical Asset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-12 py-6 bg-white/5 border border-white/10 text-white/50 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all"
                  >
                    Void Action
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
