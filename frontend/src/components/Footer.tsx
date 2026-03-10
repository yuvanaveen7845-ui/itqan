'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cmsAPI } from '@/lib/api';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
  const [branding, setBranding] = useState<any>({ name: 'IQTAN PERFUMES' });
  const [socials, setSocials] = useState<any>({});

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const { data } = await cmsAPI.getSettings();
        if (data.branding) setBranding(data.branding);
        if (data.social_links) setSocials(data.social_links);
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };
    fetchCMS();
  }, []);

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <p className="text-gray-400">Premium perfume collection for every occasion.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products">Products</Link></li>
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Shipping</Link></li>
              <li><Link href="#">Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Connect With Us</h3>
            <div className="flex gap-4">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-indigo-600 transition-colors">
                  <FiInstagram size={18} />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 transition-colors">
                  <FiFacebook size={18} />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-sky-500 transition-colors">
                  <FiTwitter size={18} />
                </a>
              )}
            </div>
            {!socials.instagram && !socials.facebook && !socials.twitter && (
              <p className="text-gray-500 text-xs italic">Follow us on social media for updates.</p>
            )}
          </div>
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Contact</h3>
            <div className="space-y-4">
              <p className="text-gray-400 flex items-center gap-3 text-sm">
                <FiMail className="text-indigo-500" /> info@iqtanperfumes.com
              </p>
              <p className="text-gray-400 flex items-center gap-3 text-sm">
                <FiPhone className="text-indigo-500" /> +91 XXXX XXXX XX
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800/50 pt-8 text-center text-gray-500">
          <p className="text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} {branding.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
