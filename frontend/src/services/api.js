import { auth } from '../firebase'

const BASE = import.meta.env.VITE_API_BASE || (import.meta.env.REACT_APP_API_BASE || 'http://localhost:4000/api');

async function getAuthHeader() {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    console.warn('Failed to get ID token', e.message);
  }
  // fallback to mock tokens for local dev
  const mock = localStorage.getItem('mock_token') || 'mock-faculty';
  return { Authorization: `Bearer ${mock}` };
}

export async function fetchNotices() {
  const res = await fetch(`${BASE}/notices`);
  return res.json();
}

export async function createNotice(payload) {
  const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
  const res = await fetch(`${BASE}/notices`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function updateNotice(id, payload) {
  const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteNotice(id) {
  const headers = { ...(await getAuthHeader()) };
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: 'DELETE',
    headers
  });
  return res;
}

export async function createUserProfile(profile) {
  // create user profile in backend (expects Authorization header with ID token)
  const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
  const res = await fetch(`${BASE}/users`, { method: 'POST', headers, body: JSON.stringify(profile) });
  return res.json();
}
