'use client';

import React, { useState } from 'react';
import { cardsService } from '@/services/api';

const CARD_DOMAIN = process.env.NEXT_PUBLIC_CARD_DOMAIN || 'card.web-innova.site';

export default function CreateCardPage() {
  const initialFormState = {
    nombre: '',
    segundo_nombre: '',
    apellido: '',
    segundo_apellido: '',
    empresa: '',
    titulo_puesto: '',
    telefono: '',
    correo: '',
    direccion: '',
    pagina_web: '',
    color_primario: '#1E293B',
    color_secundario: '#0284C7',
    slug: '',
    logo_url: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    facebook: '',
    twitter: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Manejo de inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'nombre' || name === 'apellido') {
        const nom = name === 'nombre' ? value : prev.nombre;
        const ape = name === 'apellido' ? value : prev.apellido;
        updated.slug = `${nom}-${ape}`
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }
      return updated;
    });
  };

  // Conversión de archivo local a Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        logo_url: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Envío a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      await cardsService.createCard(formData);
      setFeedback({
        type: 'success',
        message: '¡Tarjeta registrada exitosamente!',
        url: `${CARD_DOMAIN}/${formData.slug}`,
      });
      setFormData(initialFormState);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Error al guardar la tarjeta.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Crear Tarjeta NFC</h1>
          <p className="text-sm text-slate-500 mt-1">Configura datos, identidad de marca y redes sociales.</p>
        </div>

        {feedback && (
          <div
            className={`p-4 mb-6 rounded-xl border text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <p>{feedback.message}</p>
            {feedback.url && (
              <p className="mt-2 text-xs font-mono">
                Enlace generado:{' '}
                <a
                  href={`https://${feedback.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold"
                >
                  https://{feedback.url}
                </a>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Slug */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Enlace Web (Slug NFC) *
            </label>
            <div className="flex items-center mt-1">
              <span className="text-slate-400 text-sm font-mono select-none mr-2">
                {CARD_DOMAIN}/
              </span>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="juan-perez"
                className="flex-1 bg-white border border-slate-300 px-3 py-2 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Información Personal */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">1. Datos Personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primer Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Segundo Nombre</label>
                <input
                  type="text"
                  name="segundo_nombre"
                  value={formData.segundo_nombre}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primer Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Segundo Apellido</label>
                <input
                  type="text"
                  name="segundo_apellido"
                  value={formData.segundo_apellido}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Empresa y Cargo */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">2. Empresa y Cargo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Puesto / Título</label>
                <input
                  type="text"
                  name="titulo_puesto"
                  value={formData.titulo_puesto}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">3. Contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+507 6000-0000"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Página Web</label>
                <input
                  type="url"
                  name="pagina_web"
                  value={formData.pagina_web}
                  onChange={handleChange}
                  placeholder="https://empresa.com"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Identidad de Marca y Logo en Base64 */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">4. Identidad y Logo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Logo o Foto de Perfil</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-16 h-16 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.logo_url ? (
                      <img
                        src={formData.logo_url}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">Sin logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-xs text-slate-500
                        file:mr-3 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-xs file:font-semibold
                        file:bg-slate-900 file:text-white
                        hover:file:bg-slate-800 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      JPG, PNG o WEBP (máximo 2 MB). Se incrusta directamente en la base de datos.
                    </p>
                  </div>
                  {formData.logo_url && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, logo_url: '' }))}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <input
                    type="color"
                    name="color_primario"
                    value={formData.color_primario}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Color Primario</p>
                    <p className="text-xs text-slate-500 font-mono">{formData.color_primario}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <input
                    type="color"
                    name="color_secundario"
                    value={formData.color_secundario}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Color Secundario</p>
                    <p className="text-xs text-slate-500 font-mono">{formData.color_secundario}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">5. Redes Sociales (Opcionales)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram (@usuario o URL)</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@usuario o enlace completo"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn (URL o usuario)</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/usuario"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">TikTok (@usuario)</label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  placeholder="@usuario"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook (URL)</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="facebook.com/pagina"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">X / Twitter (@usuario)</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="@usuario"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Crear Perfil NFC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}