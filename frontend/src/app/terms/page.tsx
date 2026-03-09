'use client';

import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Terms of Service</span>
                </nav>

                <h1 className="text-4xl font-black text-gray-900 mb-8">Terms of Service</h1>

                <div className="prose prose-blue max-w-none space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using the Perfecta Textile Store website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Perfecta Textile Store's website for personal, non-commercial transitory viewing only.
                        </p>
                        <p>
                            This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Modify or copy the materials.</li>
                            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on Perfecta Textile Store's website are provided on an 'as is' basis. Perfecta Textile Store makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
                        <p>
                            In no event shall Perfecta Textile Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Perfecta Textile Store's website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
                        <p>
                            The materials appearing on Perfecta Textile Store's website could include technical, typographical, or photographic errors. Perfecta Textile Store does not warrant that any of the materials on its website are accurate, complete or current. Perfecta Textile Store may make changes to the materials contained on its website at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                        <p className="mb-0">
                            Perfecta Textile Store reserves the right to revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
                    Last updated: March 09, 2026
                </div>
            </div>
        </div>
    );
}
