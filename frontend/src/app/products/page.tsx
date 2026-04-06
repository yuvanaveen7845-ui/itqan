'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Select, Drawer, Badge, Button, Input } from 'antd';
import { ShoppingOutlined, SearchOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/store/cart';

const { Option } = Select;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Cart Drawer
  const [cartVisible, setCartVisible] = useState(false);
  const { items: cartItems, getTotal, removeItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters = category !== 'all' ? { Fragrance_type: category } : {};
        const { data } = await productAPI.getAll(filters);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredAndSortedProducts = [...products]
    .sort((a: any, b: any) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'popularity') return Number(b.stock) - Number(a.stock);
      return new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime();
    });

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .ant-select-selector { border-color: #f0f0f0 !important; border-radius: 6px !important; }
        .ant-select-selection-item { font-weight: 500; }
        .ant-drawer-title { font-weight: 700; letter-spacing: 0.05em; font-size: 1.1rem; }
      `}} />
      
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight text-center">All Perfumes</h1>
        </div>

        {/* Filter and Sort Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-b border-gray-100 py-4 mb-14 gap-5">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest hidden sm:inline">Filter By</span>
                <Select
                    defaultValue="all"
                    style={{ width: 180 }}
                    onChange={(val) => setCategory(val)}
                    className="font-medium"
                    size="large"
                >
                    <Option value="all">Every Scent</Option>
                    <Option value="Men">For Him</Option>
                    <Option value="Women">For Her</Option>
                    <Option value="Unisex">Unisex</Option>
                </Select>
            </div>
            
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest hidden lg:block">
                {filteredAndSortedProducts.length} Results
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest hidden sm:inline">Sort By</span>
                <Select
                    defaultValue="featured"
                    style={{ width: 220 }}
                    onChange={(val) => setSortBy(val)}
                    className="font-medium"
                    size="large"
                >
                    <Option value="featured">Featured Relevance</Option>
                    <Option value="price_asc">Price: Low to High</Option>
                    <Option value="price_desc">Price: High to Low</Option>
                    <Option value="popularity">Best Selling</Option>
                </Select>
            </div>
        </div>

        {/* Ant Design Grid System */}
        {loading ? (
            <div className="flex justify-center py-40">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C8A165] rounded-full animate-spin"></div>
            </div>
        ) : (
            <Row gutter={[24, 48]}>
                {filteredAndSortedProducts.reduce((acc: any[], product: any, index: number) => {
                    // Promotional Banner Injection
                    if (index === 4) {
                        acc.push(
                            <Col xs={24} key="promo-banner">
                                <div className="bg-[#f5e6d3] w-full py-16 px-8 text-center rounded-2xl flex flex-col items-center justify-center my-8 transition-transform duration-500 hover:scale-[1.01]">
                                    <h2 className="text-[#a68249] font-black uppercase tracking-[0.25em] text-xs md:text-sm mb-4">Limited Time Deal</h2>
                                    <h3 className="text-3xl md:text-[40px] leading-tight font-bold text-gray-900 mb-8 max-w-2xl">Special Offer – Buy Any 3 Premium Perfumes for ₹1298</h3>
                                    <Button type="primary" size="large" className="bg-black hover:bg-gray-800 text-white uppercase tracking-[0.15em] font-semibold px-12 border-none h-14 rounded-full text-sm shadow-xl">
                                        Shop The Offer
                                    </Button>
                                </div>
                            </Col>
                        );
                    }
                    acc.push(
                        <Col xs={24} sm={12} lg={6} key={product.id || index}>
                             <ProductCard product={product} badge={index % 3 === 0 ? "Bestseller" : index % 5 === 0 ? "20% OFF" : undefined} />
                        </Col>
                    );
                    return acc;
                }, [])}
            </Row>
        )}

      </main>

    </div>
  );
}
