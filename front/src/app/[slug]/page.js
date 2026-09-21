'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { cardsService } from '@/services/api';

export default function CardProfilePage() {
  const params = useParams();
  const slug = params?.slug;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCard = async () => {
    try {
      const response = await cardsService.getPublicCard(slug);
      setCard(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cargar la tarjeta.');
    } finally {
      setLoading(false);
    }
  };

  fetchCard();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h1 className="text-xl font-bold text-slate-800">Perfil no disponible</h1>
        <p className="text-sm text-slate-500 mt-2">{error || 'La tarjeta solicitada no existe o está desactivada.'}</p>
      </div>
    );
  }

  const nombreCompleto = [card.nombre, card.segundo_nombre, card.apellido, card.segundo_apellido]
    .filter(Boolean)
    .join(' ');

  const iniciales = `${card.nombre?.[0] || ''}${card.apellido?.[0] || ''}`.toUpperCase();
  const vcardUrl = cardsService.getVCardUrl(card.slug);

  // Limpiar número para WhatsApp (solo dígitos)
  const phoneClean = card.telefono ? card.telefono.replace(/[^0-9]/g, '') : '';

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center sm:py-8">
      <div className="w-full max-w-md bg-white sm:rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-screen sm:min-h-0">
        
        {/* Banner Superior con Color Primario */}
        <div 
          className="h-36 w-full relative flex items-end justify-center"
          style={{ backgroundColor: card.color_primario || '#1E293B' }}
        >
          {/* Avatar con Iniciales */}
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg absolute -bottom-12 flex items-center justify-center">
            <div 
              className="w-full h-full rounded-full flex items-center justify-center font-bold text-2xl text-white select-none"
              style={{ backgroundColor: card.color_secundario || '#0284C7' }}
            >
              {iniciales}
            </div>
          </div>
        </div>

        {/* Encabezado del Perfil */}
        <div className="pt-16 pb-4 px-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {nombreCompleto}
          </h1>
          {card.titulo_puesto && (
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              {card.titulo_puesto}
            </p>
          )}
          {card.empresa && (
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {card.empresa}
            </p>
          )}
        </div>

        {/* Botón Principal: Guardar Contacto (.VCF) */}
        <div className="px-6 py-2">
          <a
            href={vcardUrl}
            className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold text-sm shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: card.color_secundario || '#0284C7' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Guardar Contacto
          </a>
        </div>

        {/* Lista de Acciones Directas */}
        <div className="p-6 space-y-3 flex-1">
          
          {/* Llamada Directa */}
          {card.telefono && (
            <a
              href={`tel:${card.telefono}`}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-xs text-slate-400 font-medium">Llamar</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{card.telefono}</p>
              </div>
            </a>
          )}

          {/* WhatsApp */}
          {card.telefono && (
            <a
              href={`https://wa.me/${phoneClean}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-xs text-slate-400 font-medium">WhatsApp</p>
                <p className="text-sm font-semibold text-slate-800">Enviar mensaje</p>
              </div>
            </a>
          )}

          {/* Correo */}
          {card.correo && (
            <a
              href={`mailto:${card.correo}`}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-xs text-slate-400 font-medium">Correo</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{card.correo}</p>
              </div>
            </a>
          )}

          {/* Sitio Web */}
          {card.pagina_web && (
            <a
              href={card.pagina_web.startsWith('http') ? card.pagina_web : `https://${card.pagina_web}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-xs text-slate-400 font-medium">Sitio Web</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{card.pagina_web}</p>
              </div>
            </a>
          )}

          {/* Ubicación / Dirección */}
          {card.direccion && (
            <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-400 font-medium">Ubicación</p>
                <p className="text-sm text-slate-700 leading-snug">{card.direccion}</p>
              </div>
            </div>
          )}

        </div>

        {/* Pie de tarjeta sutil */}
        <div className="py-4 text-center border-t border-slate-100 bg-slate-50">
          <p className="text-[11px] text-slate-400">
            Tarjeta de presentación digital NFC
          </p>
        </div>

      </div>
    </main>
  );
}