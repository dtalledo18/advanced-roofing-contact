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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Error en el envío');
            router.push('/contact-us/thank-you');
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

    // Cambiamos placeholder-white/50 (que es 50% transparente) por placeholder-white (opaco)
    const inputClass = "w-full p-3 rounded-lg text-white placeholder-white border border-white/10 bg-black/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400";

    return (
        <>
            {/* Load Montserrat from Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Montserrat', sans-serif; box-sizing: border-box; }
        select option { background: #1a3f6f; color: white; }
      `}</style>

            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col"
                style={{ backgroundImage: "url('/contact-background.png')" }}
            >
                {/* ── Navbar ─────────────────────────────────────────── */}
                <nav className="relative z-20 w-full py-6 px-6">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center">

                        {/* Logo a la izquierda */}
                        <div className="flex justify-start">
                            <img src="/advanced-icon.png" alt="Advanced Logo" className="h-10 w-auto" />
                        </div>

                        {/* Nav Container centrado */}
                        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 shadow-lg">
                            {/* Links */}
                            <div className="flex items-center gap-8 px-6">
                                {['Website', 'About Us', 'Comercial Roofing'].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-white text-sm font-medium hover:text-yellow-400 transition-colors"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>

                            {/* Contact CTA */}
                            <a
                                href="#"
                                className="bg-yellow-400 text-black text-sm font-bold px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors"
                            >
                                Contact
                            </a>
                        </div>

                        {/* Espacio derecho vacío para equilibrar el grid */}
                        <div />
                    </div>
                </nav>

                {/* ── Main: 2 columns ────────────────────────────────── */}
                <main className="relative z-10 flex-grow flex flex-col justify-between">
                    {/* Contenedor principal con grid */}
                    <div className="max-w-[1500px] mx-auto w-full px-6 pt-6 grid grid-cols-2 gap-8 items-start flex-grow">

                        {/* ── LEFT — Testimonios (Bajados con self-end) ── */}
                        <div className="flex-1 flex flex-col justify-end h-full">
                            <div className="mt-auto pb-12">
                                <div className="flex items-end gap-4 overflow-x-auto pb-4">
                                    {testimonials.map((t, i) => (
                                        <div
                                            key={i}
                                            // Eliminamos space-y-2 y añadimos flex flex-col h-full para controlar la altura
                                            className="w-52 rounded-xl p-4 flex flex-col h-[220px] flex-shrink-0"
                                            style={{
                                                background: 'rgba(81,81,81,0.08)',
                                                backdropFilter: 'blur(10px)',
                                                WebkitBackdropFilter: 'blur(15px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            {/* Stars */}
                                            <div className="flex gap-0.5 mb-3">
                                                {Array.from({ length: t.stars }).map((_, s) => (
                                                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FACC15">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                            </div>

                                            {/* Título */}
                                            <p className="text-white font-bold text-sm leading-snug mb-4">{t.title}</p>

                                            {/* Contenido (flex-grow hace que empuje el autor al fondo) */}
                                            <p className="text-white text-xs leading-relaxed flex-grow">{t.body}</p>

                                            {/* Autor en color #F3C200 - Siempre abajo por el flex-grow de arriba */}
                                            <p className="text-[#F3C200] text-xs font-semibold mt-4">{t.author}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Headline + Form card + CTA */}
                        <div className="flex flex-col gap-6 w-full max-w-xl ml-auto items-center md:items-center">

                            {/* Headline */}
                            <h1
                                className="text-white font-semibold leading-tight text-center"
                                style={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    lineHeight: '1.1'
                                }}
                            >
                                Schedule your <span className="text-yellow-400">FREE</span>
                                <br className="hidden md:block" />
                                <span className="text-yellow-400">INSPECTION</span> now!
                            </h1>

                            {/* Asegúrate de que inputClass tenga estas clases o aplícalas directamente */}
                            <div
                                className="w-full rounded-3xl p-6 space-y-4 shadow-2xl"
                                style={{
                                    background: 'rgba(136,136,136,0.08)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="firstName"
                                        placeholder="Full name"
                                        onChange={handleInputChange}
                                        className={`${inputClass} text-white placeholder-white`}
                                        required
                                    />
                                    <select
                                        name="issue"
                                        onChange={handleInputChange}
                                        className={`${inputClass} text-white appearance-none`}
                                    >
                                        <option value="" className="text-gray-500">Issue</option>
                                        <option value="Repair" className="text-black">Repair</option>
                                        <option value="Replacement" className="text-black">Replacement</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="phone"
                                        placeholder="Phone number"
                                        onChange={handleInputChange}
                                        className={`${inputClass} text-white placeholder-white`}
                                        required
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        onChange={handleInputChange}
                                        className={`${inputClass} text-white placeholder-white`}
                                        required
                                    />
                                </div>

                                <input
                                    name="address"
                                    placeholder="Address"
                                    onChange={handleInputChange}
                                    className={`${inputClass} text-white placeholder-white`}
                                />
                                <input
                                    name="zipCode"
                                    placeholder="Zip code"
                                    onChange={handleInputChange}
                                    className={`${inputClass} text-white placeholder-white`}
                                />
                                <textarea
                                    name="message"
                                    placeholder="Extra notes"
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`${inputClass} text-white placeholder-white resize-none`}
                                />
                            </div>

                            {/* CTA button */}
                            <button
                                onClick={handleSubmit}
                                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-lg uppercase tracking-widest px-10 py-2 rounded-full transition-all shadow-lg w-full md:w-auto"
                            >
                                FREE INSPECTION
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}