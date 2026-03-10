'use client';

import { useState } from 'react';
import { FiCheck, FiX, FiStar, FiMessageSquare, FiUser, FiBox } from 'react-icons/fi';

export default function AdminReviewsPage() {
    // Mock reviews for moderation
    const [reviews, setReviews] = useState([
        { id: '1', product: 'Premium Cotton', user: 'Sarah J.', rating: 5, comment: 'Absolutely brilliant Fragrance, highly recommended!', date: '2026-03-08', status: 'pending' },
        { id: '2', product: 'Silk Blend', user: 'Mike R.', rating: 2, comment: 'Color was slightly different than the photo.', date: '2026-03-07', status: 'pending' },
        { id: '3', product: 'Linen Fragrance', user: 'Emma W.', rating: 4, comment: 'Great quality for the price. Will buy again.', date: '2026-03-06', status: 'pending' },
    ]);

    const handleAction = (id: string, newStatus: string) => {
        setReviews(reviews.filter(r => r.id !== id));
        // In a real app, this would hit an API
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-gray-900">Review Moderation</h1>
                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wide">
                    {reviews.length} Pending
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="flex-grow space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{review.date}</span>
                            </div>
                            <p className="text-gray-800 font-medium italic">"{review.comment}"</p>
                            <div className="flex items-center gap-4 text-xs font-bold pt-2">
                                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                    <FiUser /> {review.user}
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <FiBox /> {review.product}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => handleAction(review.id, 'approved')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition"
                            >
                                <FiCheck /> Approve
                            </button>
                            <button
                                onClick={() => handleAction(review.id, 'rejected')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition"
                            >
                                <FiX /> Delete
                            </button>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FiMessageSquare size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No pending reviews to moderate</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
