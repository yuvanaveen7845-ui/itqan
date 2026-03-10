import { FiMapPin, FiClock, FiPhone, FiNavigation } from 'react-icons/fi';

export default function ShopDetailsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                        Visit <span className="text-blue-600">Our Store</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience the essence of luxury fragrances in person. Our experts are here to help you find your signature scent.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Col: Info */}
                        <div className="p-10 lg:p-12 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold mb-8 text-gray-900">Store Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FiMapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            IQTAN PERFUMES<br />
                                            M-SQUARE COMPLEX<br />
                                            Valparai MAIN Rd, Pollachi<br />
                                            Tamil Nadu 642001
                                        </p>
                                        <a
                                            href="https://maps.app.goo.gl/TGSDjVVvMSgtNRC57?g_st=iw"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                        >
                                            <FiNavigation />
                                            View on Google Maps
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FiClock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Opening Hours</h3>
                                        <p className="text-gray-600">Monday - Saturday: 10:00 AM - 9:00 PM</p>
                                        <p className="text-gray-600">Sunday: Closed</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FiPhone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Contact Us</h3>
                                        <p className="text-gray-600">+91 98765 43210</p>
                                        <p className="text-blue-600 font-medium mt-1">itqanperfumes@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Image block */}
                        <div className="bg-gray-900 relative min-h-[300px] md:min-h-full flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/80 z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1608698144186-07fbf6ed7264?auto=format&fit=crop&q=80&w=800"
                                alt="Luxury Perfume Store"
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                            <div className="relative z-20 text-center p-8">
                                <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                    <FiMapPin className="text-white" size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 tracking-widest">IQTAN</h3>
                                <p className="text-blue-200 font-medium uppercase tracking-[0.3em] text-xs">Flagship Store</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
