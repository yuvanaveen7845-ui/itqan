'use client';
import { useEffect } from 'react';
import { useCMSStore } from '@/store/cms';

export default function CMSInitializer() {
    const fetchCMS = useCMSStore((state) => state.fetchCMS);

    useEffect(() => {
        fetchCMS();
    }, [fetchCMS]);

    return null;
}
