'use client';

import { useEffect, useState } from 'react';
import { adminAPI, productAPI } from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiPackage } from 'react-icons/fi';

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
    const amount = prompt("Enter amount to add to ALL low stock items (Stock <= 10):");
    if (!amount || isNaN(parseInt(amount))) return;

    const lowStockItems = products.filter(p => p.stock <= 10);
    if (lowStockItems.length === 0) {
      alert("No low stock items detected.");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(lowStockItems.map(p =>
        productAPI.update(p.id, { stock: p.stock + parseInt(amount) })
      ));
      alert(`Successfully replenished ${lowStockItems.length} items.`);
      fetchInventory();
    } catch (error) {
      alert("Failed to perform bulk replenish.");
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
      alert('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        setProducts(products.filter((p: any) => p.id !== id));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const lowStockCount = products.filter(p => p.stock <= 10).length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 border-l-8 border-premium-gold pl-4">Inventory Engine</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 ml-4">Real-time Logistics & Supply Control</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-premium-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-premium-black transition shadow-lg shadow-blue-200"
            >
              <FiPlus /> New Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-[2rem] flex items-center gap-6 transition-all border ${lowStockCount > 0 ? 'bg-rose-50 border-rose-100 shadow-lg shadow-rose-100' : 'bg-gray-50 border-gray-100'}`}>
            <div className={`p-4 rounded-2xl shadow-xl ${lowStockCount > 0 ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-gray-200 text-gray-400'}`}>
              <FiAlertCircle size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Stock Alerts</p>
              <h3 className={`text-3xl font-black ${lowStockCount > 0 ? 'text-rose-900' : 'text-gray-900'}`}>{lowStockCount} Items</h3>
              {lowStockCount > 0 && (
                <button onClick={bulkReplenish} className="text-[10px] font-black uppercase text-rose-600 underline mt-2">Quick Replenish All</button>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-6">
            <div className="bg-blue-100 text-premium-gold p-4 rounded-2xl">
              <FiPackage size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Active SKUs</p>
              <h3 className="text-3xl font-black text-gray-900">{products.length} Units</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto"></div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                  <th className="px-10 py-5">Intel Asset</th>
                  <th className="px-10 py-5 text-center">Incentive</th>
                  <th className="px-10 py-5">Stock Reserve</th>
                  <th className="px-10 py-5">Lifecycle</th>
                  <th className="px-10 py-5 text-right">Sequence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {products.map((product: any) => (
                  <tr key={product.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 group-hover:bg-premium-gold group-hover:text-white transition-all duration-500 overflow-hidden">
                            {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <FiPackage size={24} />}
                          </div>
                          {product.stock <= 5 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full border-2 border-white animate-bounce"></div>}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-premium-black transition-colors uppercase tracking-tight">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">SKU: {product.sku || product.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="font-black text-gray-900 text-lg">₹{product.price.toLocaleString()}</span>
                      {product.discount > 0 && <span className="block text-[10px] font-black text-rose-500 uppercase">-{product.discount}% OFF</span>}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${product.stock > 50 ? 'bg-green-500' : product.stock > 10 ? 'bg-orange-400' : 'bg-rose-500'}`} style={{ width: `${Math.min(product.stock, 100)}%` }}></div>
                        </div>
                        <span className={`text-xs font-black ${product.stock <= 10 ? 'text-rose-600' : 'text-gray-500'}`}>
                          {product.stock} UNITS
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-100' :
                        product.stock > 0 ? 'bg-orange-50 text-orange-700 border-orange-100 shadow-sm shadow-orange-50' :
                          'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
                        }`}>
                        {product.stock > 10 ? 'Prime' : product.stock > 0 ? 'Depleted' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-3 bg-white text-gray-600 rounded-xl hover:bg-premium-gold hover:text-white transition shadow-sm border border-gray-100"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-3 bg-white text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm border border-gray-100">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    placeholder="e.g. Premium Cotton Fragrance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    rows={3}
                    placeholder="Describe the Perfume quality, feel, and use case..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Offer Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    placeholder="Current selling price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    placeholder="Price before discount"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    placeholder="e.g. 20"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock Units</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    placeholder="Initial inventory"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Fragrance Type</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    value={formData.Fragrance_type}
                    onChange={(e) => setFormData({ ...formData, Fragrance_type: e.target.value })}
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Silk">Silk</option>
                    <option value="Linen">Linen</option>
                    <option value="Wool">Wool</option>
                    <option value="Perfume">Perfume</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                    placeholder="e.g. Royal Blue"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-gray-700">Product Images</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                      className="text-xs font-bold text-premium-gold hover:text-premium-black flex items-center gap-1"
                    >
                      <FiPlus /> Add Image URL
                    </button>
                  </div>
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-premium-gold outline-none"
                        placeholder="Paste Unsplash or external image URL"
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
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400">Provide multiple URLs for a product gallery. The first image will be the primary one.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-4 rounded-xl bg-premium-gold text-white font-black hover:bg-premium-black transition shadow-lg shadow-blue-200 disabled:bg-blue-400"
                >
                  {formLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
