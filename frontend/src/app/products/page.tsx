'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fabric_type: '',
    price_min: '',
    price_max: '',
    search: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await productAPI.getAll(filters);
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const [sortBy, setSortBy] = useState('latest');

  // Client-side sorting and additional filtering for mock data
  const filteredAndSortedProducts = [...products]
    .sort((a: any, b: any) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // 'latest'
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort By:</label>
          <select
            className="input py-2 bg-white border-gray-300"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="col-span-1">
          <div className="card sticky top-4">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Filters</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                className="input"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category / Fabric</label>
              <select
                className="input"
                value={filters.fabric_type}
                onChange={(e) => setFilters({ ...filters, fabric_type: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Cotton">Cotton</option>
                <option value="Silk">Silk</option>
                <option value="Linen">Linen</option>
                <option value="Wool">Wool</option>
                <option value="Perfume">Perfume</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="input w-1/2"
                  placeholder="Min"
                  value={filters.price_min}
                  onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                />
                <input
                  type="number"
                  className="input w-1/2"
                  placeholder="Max"
                  value={filters.price_max}
                  onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select className="input text-gray-500" disabled title="Will be enabled when connected to real DB">
                <option value="">All Brands</option>
                <option value="zara">Premium Mills</option>
                <option value="h&m">Artisan Loom</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <div className="flex gap-2">
                {[4, 3, 2, 1].map(rating => (
                  <button key={rating} className="flex-1 py-1 border rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1 text-gray-400 cursor-not-allowed" title="Will be enabled when connected to real DB">
                    {rating}★+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-span-1 lg:col-span-3">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">Loading amazing products...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
              <button onClick={() => setFilters({ fabric_type: '', price_min: '', price_max: '', search: '' })} className="mt-4 btn btn-secondary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination UI - Placeholder for enterprise look */}
              <div className="mt-12 flex justify-center items-center gap-2">
                <button className="px-4 py-2 border rounded-md text-gray-400 cursor-not-allowed">Previous</button>
                <button className="px-4 py-2 border rounded-md bg-blue-600 text-white font-medium">1</button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-600">2</button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-600">3</button>
                <span className="text-gray-400">...</span>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-600">Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
