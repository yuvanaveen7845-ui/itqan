'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);

            const { clientX, clientY } = e;

            // Inner dot (smooth)
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }

            // Outer ring (trailing)
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }
        };

        const onMouseEnter = () => setIsVisible(true);
        const onMouseLeave = () => setIsVisible(false);

        const onPointerOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('mouseover', onPointerOver);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseenter', onMouseEnter);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('mouseover', onPointerOver);
        };
    }, [isVisible]);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Main Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-premium-gold rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
            />
            {/* Trailing Ring */}
            <div
                ref={ringRef}
                className={`fixed top-0 left-0 w-8 h-8 border border-premium-gold/30 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHovering ? 'scale-[2] bg-premium-gold/5 border-premium-gold/50' : 'scale-100'}`}
            />

            {/* Global Grain Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-[10000] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
    );
}
