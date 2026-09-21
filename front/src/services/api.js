import axios from 'axios';
import { USE_MOCK } from './mocks/config';
import { mockAdapter } from './mocks/mockAdapter';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // envía/recibe la cookie HttpOnly 'token' del backend
});

if (USE_MOCK) {
    api.defaults.adapter = mockAdapter;
}

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    setRol: (data) => api.post('/auth/selectRole', data),
    getMe: () => api.get('/auth/me'),
    getPermisos: () => api.get('/auth/permisos'),
    cambiarPassword: (token, password) => api.post('/usuarios/cambiar-password', { token, password }),
};

export const cardsService = {
    createCard: (cardData) => api.post('/cards', cardData),
    // Obtener los datos públicos de la tarjeta por slug
  getPublicCard: (slug) => api.get(`/cards/public/${slug}`),
  
  // Helper para armar la URL directa de descarga del contacto (.vcf)
  getVCardUrl: (slug) => `${api.defaults.baseURL}/cards/public/${slug}/vcard`,
};
export const registroService = {
    validarRuc: (ruc, tipoContribuyente) => api.get('/registro/ruc', { params: { ruc, tipoContribuyente } }),
    enviarRegistro: (formData) => api.post('/registro', formData),
};

export default api;
