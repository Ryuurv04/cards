'use client'; // Necesario si estás usando Next.js App Router (app/...)

import React, { useState } from 'react';
import { cardsService } from '@/services/api'; // Ajusta la ruta a donde tengas tu archivo con cardsService

export default function CreateCardPage() {
  const initialFormState = {
    // Datos personales
    nombre: '',
    segundo_nombre: '',
    apellido: '',
    segundo_apellido: '',

    // Empresa / Cargo
    empresa: '',
    titulo_puesto: '',

    // Contacto
    telefono: '',
    correo: '',
    direccion: '',
    pagina_web: '',

    // Personalización
    color_primario: '#1E293B',
    color_secundario: '#0284C7',

    // Identificador único
    slug: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '', url: '' }

  // Manejo de inputs con auto-generación de slug
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Si el usuario escribe nombre o apellido y no ha modificado el slug manualmente, lo auto-generamos
      if (name === 'nombre' || name === 'apellido') {
        const nom = name === 'nombre' ? value : prev.nombre;
        const ape = name === 'apellido' ? value : prev.apellido;
        
        updated.slug = `${nom}-${ape}`
          .toLowerCase()
          .trim()
          .normalize('NFD') // Quita tildes
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }

      return updated;
    });
  };

  // Función principal de envío que consume el cardsService
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      // Llamada directa a tu cardsService
      const response = await cardsService.createCard(formData);
      const resData = response.data;

      setFeedback({
        type: 'success',
        message: '¡Tarjeta registrada exitosamente!',
        url: resData?.data?.url || `card.dominio.com/${formData.slug}`,
      });

      // Opcional: resetear formulario tras éxito
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error al registrar tarjeta:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Ocurrió un error inesperado al registrar la tarjeta.';
      
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* Cabecera */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Crear Nueva Tarjeta NFC
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Llena los campos para generar el perfil digital dinámico asociado al chip.
          </p>
        </div>

        {/* Feedback visual (Éxito / Error) */}
        {feedback && (
          <div
            className={`p-4 mb-6 rounded-xl border text-sm font-medium transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <p>{feedback.message}</p>
            {feedback.url && (
              <p className="mt-2 text-xs font-mono">
                URL generada:{' '}
                <a
                  href={`https://${feedback.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold hover:text-emerald-950"
                >
                  {feedback.url}
                </a>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identificador NFC / Slug */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Enlace Web (Slug NFC) *
            </label>
            <div className="flex items-center mt-1">
              <span className="text-slate-400 text-sm font-mono select-none mr-2">
                card.dominio.com/
              </span>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="juan-perez"
                className="flex-1 bg-white border border-slate-300 px-3 py-2 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Sección Datos Personales */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Información Personal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primer Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Roberto"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Segundo Nombre</label>
                <input
                  type="text"
                  name="segundo_nombre"
                  value={formData.segundo_nombre}
                  onChange={handleChange}
                  placeholder="Ej. Carlos"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
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
                  placeholder="Ej. Morales"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Segundo Apellido</label>
                <input
                  type="text"
                  name="segundo_apellido"
                  value={formData.segundo_apellido}
                  onChange={handleChange}
                  placeholder="Ej. Castillo"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección Laboral */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Empresa y Cargo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Ej. Inversiones Globales"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Puesto</label>
                <input
                  type="text"
                  name="titulo_puesto"
                  value={formData.titulo_puesto}
                  onChange={handleChange}
                  placeholder="Ej. Gerente de Operaciones"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección Contacto */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              3. Medios de Contacto
            </h2>
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
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="contacto@empresa.com"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
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
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Física</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle 50, Edificio Plaza, Piso 4"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección Estilo / Colores */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              4. Identidad Visual
            </h2>
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

          {/* Botón Guardar */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Registrando...' : 'Crear Perfil NFC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}