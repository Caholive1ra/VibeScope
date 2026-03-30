import axios from 'axios';

function normalizeApiBaseUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';

  // If someone configured http on production, browsers will block from https frontends.
  if (typeof window !== 'undefined') {
    const isHttps = window.location?.protocol === 'https:';
    const isLocalhost = value.includes('localhost') || value.includes('127.0.0.1');
    if (isHttps && !isLocalhost && value.startsWith('http://')) {
      return value.replace('http://', 'https://');
    }
  }

  return value;
}

const apiBaseURL =
  normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

