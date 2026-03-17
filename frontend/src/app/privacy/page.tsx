'use client';

import Link from 'next/link';
import Editable from '@/components/Editable';

export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-premium-gold transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Privacy Policy</span>
                </nav>

                <Editable id="privacy_title" fallback="Privacy Policy">
                    <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>
                </Editable>

                <div className="prose prose-blue max-w-none space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <Editable id="privacy_sec1_title" fallback="1. Introduction">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        </Editable>
                        <Editable id="privacy_sec1_text" type="richtext" fallback="Welcome to iqtanperfumes. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.">
                            <p>
                                Welcome to iqtanperfumes. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </Editable>
                    </section>

                    <section>
                        <Editable id="privacy_sec2_title" fallback="2. Data We Collect">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data We Collect</h2>
                        </Editable>
                        <Editable id="privacy_sec2_text" type="richtext" fallback="We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:">
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                            </ul>
                        </Editable>
                    </section>

                    <section>
                        <Editable id="privacy_sec3_title" fallback="3. How We Use Your Data">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
                        </Editable>
                        <Editable id="privacy_sec3_text" type="richtext" fallback="We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:">
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To register you as a new customer.</li>
                                <li>To process and deliver your order.</li>
                                <li>To manage our relationship with you.</li>
                                <li>To improve our website, products/services, marketing and customer relationships.</li>
                            </ul>
                        </Editable>
                    </section>

                    <section>
                        <Editable id="privacy_sec4_title" fallback="4. Data Security">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        </Editable>
                        <Editable id="privacy_sec4_text" type="richtext" fallback="We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.">
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </Editable>
                    </section>

                    <section>
                        <Editable id="privacy_sec5_title" fallback="5. Your Legal Rights">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Legal Rights</h2>
                        </Editable>
                        <Editable id="privacy_sec5_text" type="richtext" fallback="Under certain circumstances, you have rights under data protection laws in relation to your personal data...">
                            <p>
                                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, and the right to withdraw consent.
                            </p>
                        </Editable>
                    </section>

                    <section className="bg-premium-cream p-6 rounded-2xl border border-blue-100">
                        <Editable id="privacy_contact_title" fallback="Contact Us">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
                        </Editable>
                        <Editable id="privacy_contact_text" type="richtext" fallback="If you have any questions about this privacy policy or our privacy practices, please contact us at:">
                            <p className="mb-0">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: <br />
                                <a href="mailto:privacy@iqtanperfumes.com" className="text-premium-gold font-bold hover:underline">privacy@iqtanperfumes.com</a>
                            </p>
                        </Editable>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
                    <Editable id="privacy_last_updated" fallback="Last updated: March 09, 2026">
                        Last updated: March 09, 2026
                    </Editable>
                </div>
            </div>
        </div>
    );
}
