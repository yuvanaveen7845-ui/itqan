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

interface CMSStore {
    branding: Branding;
    socials: SocialLinks;
    isInitialized: boolean;
    fetchCMS: () => Promise<void>;
    updateBranding: (branding: Branding) => void;
    updateSocials: (socials: SocialLinks) => void;
}

export const useCMSStore = create<CMSStore>((set) => ({
    branding: { name: 'IQTAN PERFUMES', primary_color: '#4f46e5' },
    socials: {},
    isInitialized: false,
    fetchCMS: async () => {
        try {
            const { data } = await cmsAPI.getSettings();
            if (data) {
                set({
                    branding: data.branding || { name: 'IQTAN PERFUMES', primary_color: '#4f46e5' },
                    socials: data.social_links || {},
                    isInitialized: true
                });
            }
        } catch (error) {
            console.error('Failed to fetch CMS state:', error);
            set({ isInitialized: true });
        }
    },
    updateBranding: (branding) => set({ branding }),
    updateSocials: (socials) => set({ socials }),
}));
