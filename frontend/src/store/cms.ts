'use create';

import { create } from 'zustand';
import { cmsAPI } from '@/lib/api';

interface Branding {
    name: string;
    logo_url?: string;
    favicon_url?: string;
    primary_color?: string;
}

interface SocialLinks {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
}

interface Announcement {
    text: string;
    link?: string;
    is_active: boolean;
}

interface FooterSettings {
    about_text?: string;
    copyright_text?: string;
    contact_email?: string;
    contact_phone?: string;
}

interface CMSStore {
    branding: Branding;
    socials: SocialLinks;
    announcement: Announcement;
    footer: FooterSettings;
    isInitialized: boolean;
    fetchCMS: () => Promise<void>;
}

export const useCMSStore = create<CMSStore>((set) => ({
    branding: { name: 'IQTAN PERFUMES', primary_color: '#C5A059' },
    socials: {},
    announcement: { text: 'Complimentary Signature Discovery Set on orders above $150', link: '', is_active: true },
    footer: {
        about_text: 'Discover the essence of luxury with our ultra-premium fragrance collection.',
        copyright_text: 'All rights reserved.',
        contact_email: 'info@iqtan.com',
        contact_phone: '+91 XXXX XXXX XX'
    },
    isInitialized: false,
    fetchCMS: async () => {
        try {
            const { data } = await cmsAPI.getSettings();
            if (data) {
                set({
                    branding: data.branding || { name: 'IQTAN PERFUMES', primary_color: '#C5A059' },
                    socials: data.social_links || {},
                    announcement: data.announcement || { text: 'Complimentary Signature Discovery Set on orders above $150', link: '', is_active: true },
                    footer: data.footer || {
                        about_text: 'Discover the essence of luxury with our ultra-premium fragrance collection.',
                        copyright_text: 'All rights reserved.',
                        contact_email: 'info@iqtan.com',
                        contact_phone: '+91 XXXX XXXX XX'
                    },
                    isInitialized: true
                });
            }
        } catch (error) {
            console.error('Failed to fetch CMS state:', error);
            set({ isInitialized: true });
        }
    },
}));
