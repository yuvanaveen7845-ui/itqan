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
    fabric_type: 'Cotton',
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

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        original_price: (product.original_price || '').toString(),
        discount: (product.discount || '').toString(),
        fabric_type: product.fabric_type || 'Cotton',
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
        fabric_type: 'Cotton',
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
        console.log('Submitting Product Payload:', payload);
        await productAPI.create(payload);
      }
      fetchInventory();
      setShowModal(false);
    } catch (error: any) {
      console.error('Save error details:', error.response?.data);
      const errorData = error.response?.data;
      const message = errorData?.details || errorData?.error || error.message || 'Failed to save product';
      alert(`Backend Error: ${message}`);
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-gray-900">Inventory Control</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <FiPlus /> Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Utility Cards */}
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-orange-500 text-white p-3 rounded-xl shadow-lg shadow-orange-200">
              <FiAlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-1">Low Stock Alerts</p>
              <h3 className="text-2xl font-black text-orange-900">4 Items</h3>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-xl shadow-lg shadow-blue-200">
              <FiPackage size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-1">Total SKU</p>
              <h3 className="text-2xl font-black text-blue-900">{products.length} Products</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                          <FiPackage />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold">₹{product.price.toLocaleString()}</td>
                    <td className="px-8 py-4 font-black">
                      <span className={product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-200' :
                        product.stock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {product.stock > 10 ? 'Healthy' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-gray-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition">
                          <FiTrash2 />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Premium Cotton Fabric"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    rows={3}
                    placeholder="Describe the textile quality, feel, and use case..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Offer Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Price before discount"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. 20"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock Units</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Initial inventory"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Fabric Type</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.fabric_type}
                    onChange={(e) => setFormData({ ...formData, fabric_type: e.target.value })}
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
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
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FiPlus /> Add Image URL
                    </button>
                  </div>
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
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
                  className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-blue-400"
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
