// Bellavita UI: Global Footer
'use client';

import Link from 'next/link';
import { useCMSStore } from '@/store/cms';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  const branding = useCMSStore((state) => state.branding);

  return (
    <footer className="bg-[#f9f9f9] border-t border-gray-200 mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black uppercase tracking-[0.2em] text-black hover:text-[#C8A165] transition-colors">
              {branding.name || 'BELLAVITA'}
            </Link>
            <p className="text-[13px] text-gray-500 leading-relaxed font-inter">
              Discover the finest collection of premium fragrances, bath & body, and skincare crafted for your everyday luxury.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#C8A165] hover:border-[#C8A165] transition-all">
                <FiInstagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#C8A165] hover:border-[#C8A165] transition-all">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#C8A165] hover:border-[#C8A165] transition-all">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#C8A165] hover:border-[#C8A165] transition-all">
                <FiYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-black font-poppins">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Bestsellers</Link></li>
              <li><Link href="/products" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Perfumes</Link></li>
              <li><Link href="#" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Bath & Body</Link></li>
              <li><Link href="#" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Skincare</Link></li>
              <li><Link href="#" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Gifting Hub</Link></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-black font-poppins">Help</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Track Order</Link></li>
              <li><Link href="#" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="text-[13px] text-gray-600 hover:text-[#C8A165] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-black font-poppins">Stay in the Loop</h4>
            <p className="text-[13px] text-gray-500 font-inter">Sign up for special offers and updates.</p>
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="bg-white border border-gray-300 px-4 py-3 text-[13px] w-full focus:outline-none focus:border-[#C8A165]" />
              <button className="bg-black text-white px-6 py-3 text-[13px] font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-500 font-inter text-center md:text-left">
            &copy; {new Date().getFullYear()} {branding.name || 'Bellavita'}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[12px] text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[12px] text-gray-500 hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
