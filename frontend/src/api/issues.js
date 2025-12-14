// src/api/issues.js
// Dokumentacyjny przykład helperów do pracy z Issue API.

import { apiRequest } from './client';

/**
 * Pobiera listę issues z backendu z opcjonalnymi filtrami.
 *
 * Przykład:
 *   fetchIssues({ status: 'OPEN', project: 1, ordering: '-created_at' })
 */
export async function fetchIssues(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (typeof params.project !== 'undefined' && params.project !== '') {
    searchParams.set('project', params.project);
  }
  if (params.ordering) {
    searchParams.set('ordering', params.ordering);
  }

  const query = searchParams.toString();
  const url = '/api/issues/' + (query ? `?${query}` : '');

  // Zwraca obiekt w stylu DRF:
  // { count, next, previous, results: [...] }
  return apiRequest(url, { auth: true });
}

/**
 * Tworzy nowe issue.
 *
 * payload powinien mieć mniej więcej:
 * {
 *   project: number,
 *   title: string,
 *   description?: string,
 *   status?: 'OPEN' | 'IN_PROGRESS' | 'DONE'
 * }
 */
export async function createIssue(payload) {
  return apiRequest('/api/issues/', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

/**
 * Aktualizuje istniejące issue (najczęściej status).
 *
 * Przykład:
 *   updateIssue(1, { status: 'IN_PROGRESS' })
 */
export async function updateIssue(id, payload) {
  return apiRequest(`/api/issues/${id}/`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}
