import api from './api';

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function signup(name: string, email: string, password: string) {
  const res = await api.post('/auth/signup', { name, email, password });
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}
