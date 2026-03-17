'use client';

import { useState } from 'react';
import { FiCheck, FiX, FiStar, FiMessageSquare, FiUser, FiBox } from 'react-icons/fi';

export default function AdminReviewsPage() {
    // Mock reviews for moderation
    const [reviews, setReviews] = useState([
        { id: '1', product: 'Oud Silk Extrait', user: 'Aristocrat_01', rating: 5, comment: 'An absolute masterpiece. The projection is unparalleled.', date: '2026-03-08', status: 'pending' },
        { id: '2', product: 'Velvet Noir', user: 'Patron_X', rating: 2, comment: 'The sillage did not meet the royal standard.', date: '2026-03-07', status: 'pending' },
        { id: '3', product: 'Imperial Linen', user: 'Duchess_M', rating: 4, comment: 'Exquisite weave, though the unboxing experience lacked grandeur.', date: '2026-03-06', status: 'pending' },
    ]);

    const handleAction = (id: string, newStatus: string) => {
        setReviews(reviews.filter(r => r.id !== id));
        // In a real app, this would hit an API
    };

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Perception Moderation</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Oversee critical acclaim and curate the public narrative.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-premium-black border border-premium-gold/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                    <span className="text-premium-gold font-black text-[10px] uppercase tracking-[0.3em]">{reviews.length} Awaiting Verdict</span>
                    <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-[#1A1A1A] rounded-none p-8 shadow-2xl border border-white/5 flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden group hover:border-premium-gold/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex-grow space-y-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1 text-premium-gold">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} size={14} className={i < review.rating ? 'fill-current drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'text-white/20'} />
                                    ))}
                                </div>
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Log Entry: {review.date}</span>
                            </div>
                            <p className="text-premium-cream font-playfair italic text-xl border-l-2 border-premium-gold/50 pl-6 my-4 leading-relaxed tracking-wide">
                                "{review.comment}"
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest pt-2">
                                <div className="flex items-center gap-2 text-premium-gold bg-premium-gold/10 border border-premium-gold/20 px-4 py-2">
                                    <FiUser size={12} /> {review.user}
                                </div>
                                <div className="flex items-center gap-2 text-white/50 bg-white/5 border border-white/10 px-4 py-2">
                                    <FiBox size={12} /> {review.product}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto relative z-10">
                            <button
                                onClick={() => handleAction(review.id, 'approved')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-premium-black border border-premium-gold/30 text-premium-gold font-black uppercase tracking-widest text-[9px] px-8 py-5 hover:bg-premium-gold hover:text-white transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                            >
                                <FiCheck size={14} /> Validate Narrative
                            </button>
                            <button
                                onClick={() => handleAction(review.id, 'rejected')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white/50 font-black uppercase tracking-widest text-[9px] px-8 py-5 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm"
                            >
                                <FiX size={14} /> Suppress Record
                            </button>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="bg-[#1A1A1A] border border-white/5 p-24 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-premium-gold/50">
                                <FiMessageSquare size={32} />
                            </div>
                            <h3 className="text-2xl font-playfair font-black text-premium-cream">The Public Frequency is Silent</h3>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-mono mt-4">Zero unverified communiques detected.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
