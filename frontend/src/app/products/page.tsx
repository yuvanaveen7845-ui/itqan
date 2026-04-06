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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .ant-select-selector { border-color: #f0f0f0 !important; border-radius: 6px !important; }
        .ant-select-selection-item { font-weight: 500; }
        .ant-drawer-title { font-weight: 700; letter-spacing: 0.05em; font-size: 1.1rem; }
      `}</style>
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-5 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4 md:hidden">
            <MenuOutlined className="text-2xl cursor-pointer text-gray-800" />
        </div>
        
        {/* Desktop Menu Left */}
        <div className="hidden md:flex items-center gap-8 text-[13px] uppercase font-semibold tracking-wider text-gray-600">
            <Link href="/" className="hover:text-[#C8A165] transition-colors">Home</Link>
            <Link href="/products" className="text-black border-b-2 border-[#C8A165] pb-1">Shop All</Link>
            <Link href="#" className="hover:text-[#C8A165] transition-colors">Bestsellers</Link>
            <Link href="#" className="hover:text-[#C8A165] transition-colors">Perfumes</Link>
        </div>

        {/* Logo Center */}
        <div className="text-2xl md:text-[28px] font-black uppercase tracking-[0.2em] text-center flex-1 md:flex-none text-black">
            BELLAVITA
        </div>

        {/* Desktop Menu Right + Icons */}
        <div className="flex items-center gap-6 justify-end">
            <div className="hidden lg:flex items-center gap-8 text-[13px] uppercase font-semibold tracking-wider text-gray-600 mr-4">
                <Link href="#" className="hover:text-[#C8A165] transition-colors">Bath & Body</Link>
                <Link href="#" className="hover:text-[#C8A165] transition-colors">Skincare</Link>
                <Link href="#" className="hover:text-[#C8A165] transition-colors">Gifting</Link>
            </div>
            
            <div className="flex items-center gap-5 text-2xl text-gray-800">
                {searchOpen ? (
                   <Input 
                     autoFocus
                     placeholder="Search..." 
                     className="w-48 rounded-full border-gray-300 font-poppins"
                     onBlur={() => setSearchOpen(false)}
                     prefix={<SearchOutlined />}
                   />
                ) : (
                   <SearchOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors" onClick={() => setSearchOpen(true)} />
                )}
                <UserOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors hidden sm:block" />
                <Badge count={cartItemCount} color="#C8A165" offset={[-2, 4]} size="small">
                    <ShoppingOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors text-2xl" onClick={() => setCartVisible(true)} />
                </Badge>
            </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <Drawer
        title="YOUR CART"
        placement="right"
        onClose={() => setCartVisible(false)}
        open={cartVisible}
        width={400}
        drawerStyle={{ backgroundColor: '#fff', fontFamily: "'Poppins', sans-serif" }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '24px' }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', padding: '0' }}
      >
        {cartItems.length === 0 ? (
            <div className="text-center py-32 px-8 flex flex-col items-center">
                <ShoppingOutlined className="text-6xl text-gray-200 mb-6" />
                <p className="text-gray-500 font-medium mb-8">Your cart is currently empty.</p>
                <Button type="primary" onClick={() => setCartVisible(false)} className="bg-black hover:bg-gray-800 border-none h-12 uppercase tracking-wide font-semibold px-8 rounded-md">
                    Continue Shopping
                </Button>
            </div>
        ) : (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.product_id} className="flex gap-5 border-b border-gray-100 pb-6">
                           <div className="w-24 h-24 bg-[#f8f8f8] rounded-md flex items-center justify-center p-2 flex-shrink-0">
                               <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                           </div>
                           <div className="flex-1 flex flex-col pt-1">
                               <h4 className="text-[13px] font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">{item.name}</h4>
                               <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-auto">Qty: {item.quantity}</p>
                               <div className="flex justify-between items-center mt-3">
                                   <span className="font-bold text-[15px]">₹{item.price}</span>
                                   <button onClick={() => removeItem(item.product_id)} className="text-[11px] uppercase tracking-wide text-gray-400 hover:text-black transition-colors font-semibold">Remove</button>
                               </div>
                           </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-100 p-6 bg-gray-50 mt-auto">
                    <div className="flex justify-between items-center mb-6 text-lg font-bold text-gray-900">
                        <span>Subtotal</span>
                        <span>₹{getTotal()}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-6">Taxes and shipping calculated at checkout</p>
                    <Button type="primary" block className="bg-black hover:bg-gray-800 border-none h-[52px] uppercase tracking-[0.1em] font-semibold text-[13px] rounded-lg">
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        )}
      </Drawer>

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
                    <Option value="price_asc">Price: Low to High</option>
                    <Option value="price_desc">Price: High to Low</option>
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
