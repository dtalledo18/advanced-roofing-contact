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
        issue: '',
        message: '',
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({
        firstName: '',
        phone: '',
        email: '',
        issue: '',
        address: '',
        message: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo al escribir
        setErrors(prev => ({
            ...prev,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const { firstName, phone, email, issue, address, message } = formData;

        const sanitized = {
            ...formData,
            firstName: firstName.trim().replace(/<[^>]*>?/gm, ''),
            address: address.trim().replace(/<[^>]*>?/gm, ''),
            message: message.trim().replace(/<[^>]*>?/gm, ''),
        };

        const newErrors = {
            firstName: '',
            phone: '',
            email: '',
            issue: '',
            address: '',
            message: '',
        };

        // ── Nombre completo ──
        if (!sanitized.firstName || sanitized.firstName.length < 2) {
            newErrors.firstName = 'Please enter a valid name.';
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(sanitized.firstName)) {
            newErrors.firstName = 'Name must contain only letters.';
        } else if (sanitized.firstName.length > 60) {
            newErrors.firstName = 'Name is too long (max 60 characters).';
        }

        // ── Teléfono ──
        const rawPhone = phone.replace(/\D/g, '');
        if (!rawPhone) {
            newErrors.phone = 'Phone number is required.';
        } else if (rawPhone.length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits.';
        } else if (rawPhone.length > 15) {
            newErrors.phone = 'Phone number is too long.';
        }

        // ── Email ──
        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // ── Servicio ──
        if (!issue) {
            newErrors.issue = 'Please select a service.';
        }

        // ── Address (Required) ──
        if (!sanitized.address || sanitized.address.trim() === '') {
            newErrors.address = 'Address is required.';
        } else if (sanitized.address.length > 120) {
            newErrors.address = 'Address is too long (max 120 characters).';
        }

        // ── Mensaje (opcional pero con límite) ──
        if (sanitized.message && sanitized.message.length > 500) {
            newErrors.message = 'Message is too long (max 500 characters).';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return null;
        }

        return sanitized;
    };

    const handleSubmit = async () => {
        const cleanData = validateForm();
        if (!cleanData) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData),
            });

            if (!response.ok) throw new Error('Error en el envío');
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('There was an error sending the form. Please try again later.');
        } finally {
            setIsLoading(false);
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

    // Clase base para inputs — borde rojo si hay error
    const inputClass = (field: keyof typeof errors) =>
        `w-full p-3 rounded-lg text-white placeholder-white border ${
            errors[field] ? 'border-red-500' : 'border-white/10'
        } bg-black/30 focus:outline-none focus:border-yellow-400/70 transition-colors duration-150`;

    // Mensaje de error reutilizable
    const ErrorMsg = ({ field }: { field: keyof typeof errors }) =>
        errors[field] ? (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors[field]}
            </p>
        ) : null;

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
                            <div className="flex-1 flex justify-start">
                                <img src="/advanced-icon.png" alt="Advanced Logo" className="h-9 w-auto" />
                            </div>
                            
                        </div>



                        {/* ── Desktop navbar ── */}
                        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
                            <div className="flex justify-start">
                                <img src="/advanced-icon.png" alt="Advanced Logo" className="h-10 w-auto" />
                            </div>

                        </div>
                    </div>
                </nav>

                {/* ════════════════════════════════════════
                    MAIN
                ════════════════════════════════════════ */}
                <main className="relative z-10 flex-grow flex flex-col">

                    {/* ── DESKTOP: 2-column grid ── */}
                    <div className="hidden min-[1400px]:flex flex-grow max-w-[1500px] mx-auto w-full px-6 pt-4 gap-8 items-stretch">

                        {/* LEFT — Testimonials */}
                        <div className="flex-1 flex flex-col justify-end pb-10">
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

                        {/* RIGHT — Headline + Form */}
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
                                        style={{ fontSize: 'clamp(2.3rem, 4.4vw, 3.4rem)', lineHeight: '1.1' }}
                                    >
                                        Schedule your <span className="text-yellow-400">FREE</span>
                                        <br />
                                        <span className="text-yellow-400">INSPECTION</span> now!
                                    </h1>

                                    <div className="w-full rounded-3xl p-6 space-y-4 shadow-2xl" style={{ background: 'rgba(136,136,136,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>

                                        {/* Row 1: Full name + Service */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <input name="firstName" placeholder="Full name" onChange={handleInputChange} className={inputClass('firstName')} />
                                                <ErrorMsg field="firstName" />
                                            </div>
                                        </div>

                                        {/* Row 2: Phone + Email */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className={inputClass('email')} />
                                                <ErrorMsg field="email" />
                                            </div>
                                            <div>
                                                <input name="phone" placeholder="Phone number" onChange={handleInputChange} className={inputClass('phone')} />
                                                <ErrorMsg field="phone" />
                                            </div>
                                        </div>

                                        <div>
                                            <select name="issue" onChange={handleInputChange} className={`${inputClass('issue')} appearance-none`}>
                                                <option value="">Select a service</option>
                                                <option value="Pitch Roofs">Pitch Roofs</option>
                                                <option value="Flat Roofs">Flat Roofs</option>
                                                <option value="Sidings">Sidings</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                            </select>
                                            <ErrorMsg field="issue" />
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <input name="address" placeholder="Address" onChange={handleInputChange} className={inputClass('address')} />
                                            <ErrorMsg field="address" />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <textarea name="message" placeholder="Extra notes" onChange={handleInputChange} rows={3} className={`${inputClass('message')} resize-none`} />
                                            <div className="flex justify-between items-start">
                                                <ErrorMsg field="message" />
                                                <span className="text-white/30 text-xs ml-auto mt-1">
                                                    {formData.message.length}/500
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-base uppercase tracking-widest px-10 py-3 rounded-full transition-all shadow-lg w-full flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : "FREE INSPECTION"}
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
                                <h1 className="text-white mt-4 font-semibold text-center" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', lineHeight: '1.15' }}>
                                    Schedule your <span className="text-yellow-400">FREE</span>
                                    <br />
                                    <span className="text-yellow-400">INSPECTION</span> now!
                                </h1>

                                <div
                                    className="w-full rounded-3xl p-5 space-y-3 shadow-2xl"
                                    style={{ background: 'rgba(136,136,136,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    {/* Full name */}
                                    <div>
                                        <input name="firstName" placeholder="Full name" onChange={handleInputChange} className={inputClass('firstName')} />
                                        <ErrorMsg field="firstName" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className={inputClass('email')} />
                                        <ErrorMsg field="email" />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <input name="phone" placeholder="Phone number" onChange={handleInputChange} className={inputClass('phone')} />
                                        <ErrorMsg field="phone" />
                                    </div>

                                    {/* Service */}
                                    <div>
                                        <div className="relative">
                                            <select name="issue" onChange={handleInputChange} className={`${inputClass('issue')} appearance-none`}>
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
                                        <ErrorMsg field="issue" />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <input name="address" placeholder="Address" onChange={handleInputChange} className={inputClass('address')} />
                                        <ErrorMsg field="address" />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <textarea name="message" placeholder="Extra notes" onChange={handleInputChange} rows={3} className={`${inputClass('message')} resize-none`} />
                                        <div className="flex justify-between items-start">
                                            <ErrorMsg field="message" />
                                            <span className="text-white/30 text-xs ml-auto mt-1">
                                                {formData.message.length}/500
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-md uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-lg w-full flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : "FREE INSPECTION"}
                                </button>
                            </>
                        )}

                        {/* ── Testimonials carousel ── */}
                        <div className="w-full mt-2">
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