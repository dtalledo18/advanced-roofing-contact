import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Envío de correo con Resend
        await resend.emails.send({
            from: 'Advanced Leads <info@contact.advancedteamelite.com>',
            to: process.env.NOTIFICATION_EMAIL || 'dtalledo@advancedteamelite.com',
            subject: `New Lead: ${body.firstName}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                    <h2 style="color: #00589e;">Nueva solicitud de inspección</h2>
                    <p><strong>Nombre:</strong> ${body.firstName}</p>
                    <p><strong>Email:</strong> ${body.email}</p>
                    <p><strong>Teléfono:</strong> ${body.phone}</p>
                    <p><strong>Dirección:</strong> ${body.address}</p>
                    <p><strong>Código Postal:</strong> ${body.zipCode}</p>
                    <p><strong>Problema:</strong> ${body.issue}</p>
                    <p><strong>Notas adicionales:</strong></p>
                    <p style="background: #f4f4f4; padding: 10px;">${body.message}</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Error en API:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}