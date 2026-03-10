'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { productAPI } from '@/lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    Fragrance_type: '',
    stock: '',
    image_url: '',
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
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
      } else {
        await productAPI.create(formData);
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
      description: product.description,
      price: product.price.toString(),
      Fragrance_type: product.Fragrance_type,
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', Fragrance_type: '', stock: '', image_url: '' });
    setShowForm(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <select
              className="input"
              value={formData.Fragrance_type}
              onChange={(e) => setFormData({ ...formData, Fragrance_type: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="Cotton">Cotton</option>
              <option value="Silk">Silk</option>
              <option value="Linen">Linen</option>
              <option value="Wool">Wool</option>
              <option value="Perfume">Perfume</option>
            </select>
            <input
              type="number"
              placeholder="Stock"
              className="input"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Image URL (Optional)"
              className="input"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
            <div className="flex gap-4 cursor-pointer">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Fragrance Type</th>
              <th className="text-left py-3">Price</th>
              <th className="text-left py-3">Stock</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{product.name}</td>
                <td className="py-3">{product.Fragrance_type}</td>
                <td className="py-3">₹{product.price}</td>
                <td className="py-3">{product.stock}</td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
