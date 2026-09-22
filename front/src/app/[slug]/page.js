'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { cardsService } from '@/services/api';

// Helper para normalizar URLs y nombres de usuario de redes sociales
const formatSocialUrl = (value, type) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const clean = value.replace(/^@/, '').trim();
  switch (type) {
    case 'instagram': return `https://instagram.com/${clean}`;
    case 'tiktok': return `https://tiktok.com/@${clean}`;
    case 'twitter': return `https://x.com/${clean}`;
    case 'linkedin': return value.includes('linkedin.com') ? `https://${value}` : `https://linkedin.com/in/${clean}`;
    case 'facebook': return value.includes('facebook.com') ? `https://${value}` : `https://facebook.com/${clean}`;
    default: return value;
  }
};

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800">Tarjeta no disponible</h1>
        <p className="text-sm text-slate-500 mt-2">{error || 'El perfil solicitado no existe o se encuentra inactivo.'}</p>
      </div>
    );
  }

  const nombreCompleto = [card.nombre, card.segundo_nombre, card.apellido, card.segundo_apellido]
    .filter(Boolean)
    .join(' ');

  const iniciales = `${card.nombre?.[0] || ''}${card.apellido?.[0] || ''}`.toUpperCase();
  const vcardUrl = cardsService.getVCardUrl(card.slug);
  const phoneClean = card.telefono ? card.telefono.replace(/[^0-9]/g, '') : '';

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center sm:py-8 sm:px-4">
      <div className="w-full max-w-md bg-white sm:rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-screen sm:min-h-0 border border-slate-200/60">
        
        {/* Cabecera / Banner Superior con Logo en Grande */}
        <div 
          className="w-full relative flex items-center justify-center p-8 transition-colors"
          style={{ backgroundColor: card.color_primario || '#1E293B' }}
        >
          {card.logo_url ? (
            <div className="w-full max-w-[280px] h-32 sm:h-36 flex items-center justify-center">
              <img
                src={card.logo_url}
                alt={card.empresa || nombreCompleto}
                className="max-h-full max-w-full object-contain drop-shadow-md select-none"
              />
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl text-white shadow-md select-none"
                style={{ backgroundColor: card.color_secundario || '#0284C7' }}
              >
                {iniciales}
              </div>
            </div>
          )}
        </div>

        {/* Nombres, Cargo y Empresa */}
        <div className="pt-6 pb-2 px-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {nombreCompleto}
          </h1>
          {card.titulo_puesto && (
            <p className="text-sm font-semibold text-slate-700 mt-1">
              {card.titulo_puesto}
            </p>
          )}
          {card.empresa && (
            <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wider uppercase">
              {card.empresa}
            </p>
          )}

          {/* Barra de Redes Sociales */}
          {(card.instagram || card.linkedin || card.tiktok || card.facebook || card.twitter) && (
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {card.instagram && (
                <a
                  href={formatSocialUrl(card.instagram, 'instagram')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {card.linkedin && (
                <a
                  href={formatSocialUrl(card.linkedin, 'linkedin')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {card.tiktok && (
                <a
                  href={formatSocialUrl(card.tiktok, 'tiktok')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              )}
              {card.facebook && (
                <a
                  href={formatSocialUrl(card.facebook, 'facebook')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
              )}
              {card.twitter && (
                <a
                  href={formatSocialUrl(card.twitter, 'twitter')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  title="X (Twitter)"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Botón Principal: Guardar Contacto (.VCF) */}
        <div className="px-6 py-3">
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

        {/* Acciones Directas de Contacto */}
        <div className="p-6 space-y-3 flex-1">
          {/* Teléfono */}
          {card.telefono && (
            <a
              href={`tel:${card.telefono}`}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
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
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
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
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-xs text-slate-400 font-medium">Correo Electrónico</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{card.correo}</p>
              </div>
            </a>
          )}

          {/* Sitio Web */}
          {card.pagina_web && (
            <a
              href={card.pagina_web.startsWith('http://') || card.pagina_web.startsWith('https://') ? card.pagina_web : `https://${card.pagina_web}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
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

          {/* Dirección */}
          {card.direccion && (
            <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-400 font-medium">Dirección</p>
                <p className="text-sm text-slate-700 leading-snug">{card.direccion}</p>
              </div>
            </div>
          )}
        </div>

        {/* Pie con tu marca oficial */}
        <div className="py-4 text-center border-t border-slate-100 bg-slate-50">
          <p className="text-[12px] text-slate-500 font-medium">
            Creado por{' '}
            <a
              href="https://web-innova.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 font-semibold hover:underline"
            >
              web-innova.site
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}