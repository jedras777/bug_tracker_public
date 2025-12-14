// src/api/client.js

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body = null,
    auth = false,
  } = options;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Prosty handler błędów – możesz rozbudować
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // ignorujemy
    }

    const error = new Error('Request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // 204 No Content itp.
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
