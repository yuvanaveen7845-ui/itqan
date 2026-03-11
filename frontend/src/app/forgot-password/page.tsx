'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            // Mock API call for password reset
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success
            setStatus('success');

            // Optional: simulate failure for testing
            // setErrorMessage('Email not found in our system.');
            // setStatus('error');
        } catch (err) {
            setErrorMessage('An unexpected error occurred. Please try again later.');
            setStatus('error');
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <div className="card shadow-2xl border-0 p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-500">No worries, we'll send you reset instructions.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg mb-8">
                            <h3 className="font-bold text-lg mb-2">Check your email</h3>
                            <p className="text-sm">We've sent a password reset link to <strong>{email}</strong>.</p>
                        </div>
                        <button onClick={() => router.push('/login')} className="w-full btn btn-primary py-3 mb-4">Back to Login</button>
                        <p className="text-sm text-gray-500">Didn't receive the email? <button onClick={() => setStatus('idle')} className="text-premium-gold font-bold hover:underline">Click to resend</button></p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={`w-full py-3 px-4 flex justify-center items-center gap-2 rounded-lg font-bold text-white transition-all shadow-md ${status === 'loading' ? 'bg-blue-400 cursor-not-allowed' : 'bg-premium-gold hover:bg-premium-black hover:shadow-lg'}`}
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Sending Instructions...
                                </>
                            ) : 'Reset Password'}
                        </button>

                        <div className="text-center pt-4 flex justify-center items-center">
                            <Link href="/login" className="text-gray-500 hover:text-gray-800 font-medium flex items-center gap-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
