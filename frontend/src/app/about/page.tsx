import { FiMapPin, FiClock, FiPhone, FiNavigation } from 'react-icons/fi';
import Editable from '@/components/Editable';

export default function ShopDetailsPage() {
    return (
        <div className="bg-white min-h-screen scroll-reveal visible">
            <section className="pt-80 pb-60 bg-premium-black grain-overlay overflow-hidden relative">
                <div className="absolute inset-0 z-0 opacity-20 scale-110">
                    <Editable id="about_hero_image" type="image" fallback="https://images.unsplash.com/photo-1595071167447-080c512365bf?auto=format&fit=crop&q=80&w=2500">
                        <img src="https://images.unsplash.com/photo-1595071167447-080c512365bf?auto=format&fit=crop&q=80&w=2500" alt="Boutique" className="w-full h-full object-cover grayscale" />
                    </Editable>
                </div>
                <div className="relative z-10 text-center px-4 boutique-layout">
                    <Editable id="about_eyebrow" type="text" fallback="The Maison">
                        <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block mb-12 animate-reveal">Our Legacy</span>
                    </Editable>
                    <Editable id="about_title" type="richtext" fallback="The Art of Fragrant Silence">
                        <h1 className="text-7xl md:text-[140px] imperial-serif text-white animate-reveal" style={{ animationDelay: '0.2s' }}>
                            A Legacy <br />
                            <span className="gold-luxury-text italic lowercase font-normal">Unspoken</span>
                        </h1>
                    </Editable>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-32">
                <div className="text-center mb-24 space-y-6">
                    <Editable id="about_subtitle" fallback="Experience olfactory excellence in its purest form">
                        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-premium-gold/60 max-w-2xl mx-auto font-inter">
                            Experience olfactory excellence in its purest form
                        </p>
                    </Editable>
                </div>

                <div className="luxury-card-rich shadow-2xl rounded-[40px] border-none overflow-hidden scroll-reveal visible">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Col: Info */}
                        <div className="p-12 lg:p-20 flex flex-col justify-center bg-white/40 backdrop-blur-md">
                            <Editable id="about_concierge_title" fallback="Concierge Details">
                                <h2 className="text-[14px] font-black mb-12 text-premium-black uppercase tracking-[0.6em] border-b border-premium-gold/20 pb-6">Concierge Details</h2>
                            </Editable>

                            <div className="space-y-12">
                                <div className="flex items-start gap-8 group">
                                    <div className="w-16 h-16 bg-premium-black text-premium-gold rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                        <FiMapPin size={28} />
                                    </div>
                                    <div>
                                        <Editable id="about_location_label" fallback="Location">
                                            <h3 className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mb-3">Location</h3>
                                        </Editable>
                                        <Editable id="about_location_text" type="richtext" fallback="IQTAN PERFUMES<br />M-SQUARE COMPLEX<br />Valparai MAIN Rd, Pollachi<br />Tamil Nadu 642001">
                                            <p className="text-premium-black text-lg imperial-serif leading-relaxed italic">
                                                IQTAN PERFUMES<br />
                                                M-SQUARE COMPLEX<br />
                                                Valparai MAIN Rd, Pollachi<br />
                                                Tamil Nadu 642001
                                            </p>
                                        </Editable>
                                        <Editable id="about_maps_link" type="link" href="https://maps.app.goo.gl/TGSDjVVvMSgtNRC57?g_st=iw" fallback="Plot Course">
                                            <a
                                                href="https://maps.app.goo.gl/TGSDjVVvMSgtNRC57?g_st=iw"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-8 inline-flex items-center gap-4 bg-premium-black text-premium-gold px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-premium-gold hover:text-black transition-all duration-700 shadow-2xl group"
                                            >
                                                <FiNavigation className="group-hover:rotate-12 transition-transform" />
                                                Plot Course
                                            </a>
                                        </Editable>
                                    </div>
                                </div>

                                <div className="flex items-start gap-8 group">
                                    <div className="w-16 h-16 bg-premium-black text-premium-gold rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                        <FiClock size={28} />
                                    </div>
                                    <div>
                                        <Editable id="about_avail_label" fallback="Availability">
                                            <h3 className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mb-3">Availability</h3>
                                        </Editable>
                                        <Editable id="about_avail_days" fallback="Monday - Saturday">
                                            <p className="text-premium-black text-lg imperial-serif italic">Monday - Saturday</p>
                                        </Editable>
                                        <Editable id="about_avail_hours" fallback="10:00 AM - 9:00 PM">
                                            <p className="text-premium-charcoal/60 text-sm font-medium tracking-[0.2em] uppercase">10:00 AM - 9:00 PM</p>
                                        </Editable>
                                        <Editable id="about_avail_sunday" fallback="Sunday: By Appointment Only">
                                            <p className="text-premium-gold/40 text-[10px] font-black mt-2 uppercase tracking-widest">Sunday: By Appointment Only</p>
                                        </Editable>
                                    </div>
                                </div>

                                <div className="flex items-start gap-8 group">
                                    <div className="w-16 h-16 bg-premium-black text-premium-gold rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                        <FiPhone size={28} />
                                    </div>
                                    <div>
                                        <Editable id="about_phone_label" fallback="Direct Line">
                                            <h3 className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mb-3">Direct Line</h3>
                                        </Editable>
                                        <Editable id="about_phone_number" fallback="+91 98765 43210">
                                            <p className="text-premium-black text-2xl font-light tracking-tighter">+91 98765 43210</p>
                                        </Editable>
                                        <Editable id="about_email" fallback="itqanperfumes@gmail.com">
                                            <p className="text-premium-gold font-black uppercase tracking-[0.3em] text-[10px] mt-2">itqanperfumes@gmail.com</p>
                                        </Editable>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Image block */}
                        <div className="bg-premium-black relative min-h-[400px] md:min-h-full flex items-center justify-center overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/20 to-black/90 z-10 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <Editable id="about_store_image" type="image" fallback="https://images.unsplash.com/photo-1608698144186-07fbf6ed7264?auto=format&fit=crop&q=80&w=800">
                                <img
                                    src="https://images.unsplash.com/photo-1608698144186-07fbf6ed7264?auto=format&fit=crop&q=80&w=800"
                                    alt="Luxury Perfume Store"
                                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-[3s]"
                                />
                            </Editable>
                            <div className="relative z-20 text-center p-12 space-y-8">
                                <div className="w-20 h-20 border-2 border-premium-gold/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-md shadow-2xl group-hover:border-premium-gold transition-colors duration-1000">
                                    <FiMapPin className="text-premium-gold animate-bounce" size={32} />
                                </div>
                                <div className="space-y-4">
                                    <Editable id="about_store_name" fallback="IQTAN">
                                        <h3 className="text-4xl lg:text-5xl font-black text-premium-gold mb-2 tracking-[0.3em] imperial-serif select-none uppercase">IQTAN</h3>
                                    </Editable>
                                    <div className="h-px w-24 bg-premium-gold/40 mx-auto"></div>
                                    <Editable id="about_store_type" fallback="Flagship Atelier">
                                        <p className="text-premium-cream font-black uppercase tracking-[0.5em] text-[10px]">Flagship Atelier</p>
                                    </Editable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
