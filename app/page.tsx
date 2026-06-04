'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        phone: '',
        email: '',
        address: '',
        zipCode: '',
        issue: '',
        message: '',
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false); // <--- Añade esta línea

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { firstName, phone, email, issue } = formData;

        // Basic sanitization: remove extra spaces and strip HTML tags
        const sanitized = {
            ...formData,
            firstName: firstName.trim().replace(/<[^>]*>?/gm, ''),
            message: formData.message.trim().replace(/<[^>]*>?/gm, ''),
        };

        // Validations
        if (!sanitized.firstName || sanitized.firstName.length < 2) {
            alert("Please enter a valid name.");
            return null;
        }
        if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
            alert("Please enter a valid phone number (at least 10 digits).");
            return null;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return null;
        }
        if (!issue) {
            alert("Please select a service.");
            return null;
        }

        return sanitized;
    };

    const handleSubmit = async () => {
        const cleanData = validateForm();

        if (!cleanData) return; // Si la validación falla, detenemos el proceso

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData), // Enviamos los datos sanitizados
            });

            if (!response.ok) throw new Error('Error en el envío');
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al enviar el formulario.');
        }
    };

    const testimonials = [
        {
            stars: 5,
            title: 'They came out quickly and did a great job.',
            body: '"We have used them in the past for larger projects, and have always been pleased."',
            author: '- Darrell T.',
        },
        {
            stars: 5,
            title: 'Would definitely recommend them.',
            body: '"They finished the work in one day, and the new roof looks great!"',
            author: '- Melinda T.',
        },
        {
            stars: 5,
            title: "Can't thank you enough!",
            body: '"Peter helped me through the whole process and was able to replace my entire roof!"',
            author: '- Yawar K.',
        },
    ];

    const inputClass =
        "w-full p-3 rounded-lg text-white placeholder-white border border-white/10 bg-black/30 focus:outline-none focus:border-yellow-400/70 transition-colors duration-150";

    const StarRow = ({ count }: { count: number }) => (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, s) => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FACC15">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { font-family: 'Montserrat', sans-serif; box-sizing: border-box; }
                select option { background: #1a3f6f; color: white; }

                /* Carousel swipe on mobile */
                .carousel-track {
                    display: flex;
                    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
            `}</style>

            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col"
                style={{ backgroundImage: "url('/contact-background.webp')" }}
            >
                {/* ════════════════════════════════════════
                    NAVBAR
                ════════════════════════════════════════ */}
                <nav className="relative z-30 w-full py-4 px-5 lg:py-6 lg:px-6">
                    <div className="max-w-[1400px] mx-auto">

                        {/* ── Mobile / Tablet navbar ── */}
                        <div className="flex items-center justify-between lg:hidden">
                            {/* Logo centrado en mobile */}
                            <div className="flex-1 flex justify-start">
                                <img src="/advanced-icon.png" alt="Advanced Logo" className="h-12 w-auto" />
                            </div>
                            {/* Hamburger */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-white p-2 rounded-lg bg-white/10 border border-white/20"
                                aria-label="Menu"
                            >
                                {menuOpen ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                ) : (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Mobile dropdown menu */}
                        {menuOpen && (
                            <div
                                className="lg:hidden mt-3 p-4 space-y-2"
                                style={{
                                    background: 'rgba(20, 20, 20, 0.25)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '1.5rem',
                                }}
                            >
                                {[
                                    { label: 'Website', href: 'https://www.advancedroofingteam.com/' },
                                    { label: 'About Us', href: 'https://www.advancedroofingteam.com/about-us/' },
                                    { label: 'Comercial Roofing', href: 'https://www.advancedroofingteam.com/commercial-roofing/' }
                                ].map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="block text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                                {/* Botón Contact sin enlace */}
                                <div
                                    className="block bg-yellow-400 text-black text-sm font-bold text-center py-2.5 px-4 rounded-full cursor-default mt-1"
                                >
                                    Contact
                                </div>
                            </div>
                        )}

                        {/* ── Desktop navbar ── */}
                        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
                            <div className="flex justify-start">
                                <img src="/advanced-icon.png" alt="Advanced Logo" className="h-10 w-auto" />
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 shadow-lg">
                                <div className="flex items-center gap-8 px-6">
                                    {[
                                        { label: 'Website', href: 'https://www.advancedroofingteam.com/' },
                                        { label: 'About Us', href: 'https://www.advancedroofingteam.com/about-us/' },
                                        { label: 'Comercial Roofing', href: 'https://www.advancedroofingteam.com/commercial-roofing/' }
                                    ].map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="text-white text-sm font-medium hover:text-yellow-400 transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                                {/* El botón Contact queda sin link por ahora */}
                                <div className="bg-yellow-400 text-black text-sm font-bold px-6 py-2 rounded-full cursor-default">
                                    Contact
                                </div>
                            </div>
                            <div />
                        </div>
                    </div>
                </nav>

                {/* ════════════════════════════════════════
                    MAIN
                ════════════════════════════════════════ */}
                <main className="relative z-10 flex-grow flex flex-col">

                    {/* ── DESKTOP: 2-column grid ── */}
                    <div className="hidden min-[1400px]:flex flex-grow max-w-[1500px] mx-auto w-full px-6 pt-4 gap-8 items-stretch">

                        {/* LEFT — Testimonials pushed to bottom */}
                        <div className="flex-1 flex flex-col justify-end pb-10">
                            {/* Añadimos -mt-20 (o el valor que prefieras) para elevar el grupo de cards */}
                            <div className="flex items-end gap-4 mb-[30px]">
                                {testimonials.map((t, i) => (
                                    <div
                                        key={i}
                                        className="w-52 rounded-xl p-4 flex flex-col h-[220px] flex-shrink-0"
                                        style={{ background: 'rgba(81,81,81,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <StarRow count={t.stars} />
                                        <p className="text-white font-bold text-sm leading-snug mt-3 mb-3">{t.title}</p>
                                        <p className="text-white text-xs leading-relaxed flex-grow">{t.body}</p>
                                        <p className="text-[#F3C200] text-xs font-semibold mt-3">{t.author}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — Headline + Form + CTA */}
                        <div className="flex flex-col gap-5 w-full max-w-[676px] ml-auto pt-2 pb-10">
                            {isSubmitted ? (
                                <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center border border-white/20">
                                    <h2 className="text-yellow-400 text-3xl font-bold mb-4">Thank You!</h2>
                                    <p className="text-white">We have received your request and will contact you shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <h1
                                        className="text-white font-semibold text-center leading-tight tracking-[0.08em]"
                                        style={{
                                            fontSize: 'clamp(2.3rem, 4.4vw, 3.4rem)',
                                            lineHeight: '1.1'
                                        }}
                                    >
                                        Schedule your <span className="text-yellow-400">FREE</span>
                                        <br />
                                        <span className="text-yellow-400">INSPECTION</span> now!
                                    </h1>
                                    <div className="w-full rounded-3xl p-6 space-y-6 shadow-2xl" style={{ background: 'rgba(136,136,136,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input name="firstName" placeholder="Full name" onChange={handleInputChange} className={inputClass} required />
                                            <select name="issue" onChange={handleInputChange} className={`${inputClass} appearance-none`}>
                                                <option value="">Select a service</option>
                                                <option value="Pitch Roofs">Pitch Roofs</option>
                                                <option value="Flat Roofs">Flat Roofs</option>
                                                <option value="Sidings">Sidings</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 ">
                                            <input name="phone" placeholder="Phone number" onChange={handleInputChange} className={inputClass} required />
                                            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className={inputClass} required />
                                        </div>
                                        <input name="address" placeholder="Address" onChange={handleInputChange} className={inputClass}  />
                                        <input name="zipCode" placeholder="Zip code" onChange={handleInputChange} className={inputClass} />
                                        <textarea name="message" placeholder="Extra notes" onChange={handleInputChange} rows={3} className={`${inputClass} resize-none`} />
                                    </div>
                                    <button onClick={handleSubmit} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-base uppercase tracking-widest px-10 py-3 rounded-full transition-all shadow-lg w-full">
                                        FREE INSPECTION
                                    </button>
                                </>
                            )}

                        </div>
                    </div>

                    {/* ── MOBILE + TABLET: single column ── */}
                    <div className="min-[1400px]:hidden flex flex-col w-full max-w-lg mx-auto px-5 pt-2 pb-8 gap-5">

                        {isSubmitted ? (
                            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center border border-white/20">
                                <h2 className="text-yellow-400 text-3xl font-bold mb-4">Thank You!</h2>
                                <p className="text-white">We have received your request and will contact you shortly.</p>
                            </div>
                        ) : (
                            <>
                                {/* Headline */}
                                <h1 className="text-white mt-4 font-semibold text-center" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', lineHeight: '1.15' }}>
                                    Schedule your <span className="text-yellow-400">FREE</span>
                                    <br />
                                    <span className="text-yellow-400">INSPECTION</span> now!
                                </h1>

                                {/* Form card */}
                                <div
                                    className="w-full rounded-3xl p-5 space-y-3 shadow-2xl"
                                    style={{ background: 'rgba(136,136,136,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    {/* Full name full width on mobile */}
                                    <input name="firstName" placeholder="Full name" onChange={handleInputChange} className={inputClass} required />

                                    {/* Issue full width */}
                                    <div className="relative">

                                        <select name="issue" onChange={handleInputChange} className={`${inputClass} appearance-none`}>
                                            <option value="">Select a service</option>
                                            <option value="Pitch Roofs">Pitch Roofs</option>
                                            <option value="Flat Roofs">Flat Roofs</option>
                                            <option value="Sidings">Sidings</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                        </select>

                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>

                                    <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className={inputClass} required />
                                    <input name="phone" placeholder="Phone number" onChange={handleInputChange} className={inputClass} required />
                                    <input name="address" placeholder="Address" onChange={handleInputChange} className={inputClass} />
                                    <input name="zipCode" placeholder="Zip code" onChange={handleInputChange} className={inputClass} />
                                    <textarea name="message" placeholder="Extra notes" onChange={handleInputChange} rows={3} className={`${inputClass} resize-none`} />
                                </div>

                                {/* CTA button */}
                                <button
                                    onClick={handleSubmit}
                                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-md uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-lg w-full"
                                >
                                    FREE INSPECTION
                                </button>
                            </>
                        )}



                        {/* ── Testimonials carousel ── */}
                        <div className="w-full mt-2">
                            {/* Overflow clip container */}
                            <div className="overflow-hidden rounded-2xl">
                                <div
                                    className="carousel-track"
                                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                                >
                                    {testimonials.map((t, i) => (
                                        <div
                                            key={i}
                                            className="min-w-full p-5 flex flex-col gap-3"
                                            style={{
                                                background: 'rgba(81,81,81,0.12)',
                                                backdropFilter: 'blur(10px)',
                                                WebkitBackdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '1rem',
                                            }}
                                        >
                                            <StarRow count={t.stars} />
                                            <p className="text-white font-bold text-sm leading-snug">{t.title}</p>
                                            <p className="text-white/80 text-xs leading-relaxed">{t.body}</p>
                                            <p className="text-[#F3C200] text-xs font-semibold">{t.author}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dots + arrows */}
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    onClick={() => setActiveSlide((p) => Math.max(0, p - 1))}
                                    className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
                                    disabled={activeSlide === 0}
                                    aria-label="Previous"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>

                                <div className="flex gap-2">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveSlide(i)}
                                            className="rounded-full transition-all duration-300"
                                            style={{
                                                width: activeSlide === i ? '24px' : '8px',
                                                height: '8px',
                                                background: activeSlide === i ? '#FACC15' : 'rgba(255,255,255,0.35)',
                                            }}
                                            aria-label={`Slide ${i + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setActiveSlide((p) => Math.min(testimonials.length - 1, p + 1))}
                                    className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
                                    disabled={activeSlide === testimonials.length - 1}
                                    aria-label="Next"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}