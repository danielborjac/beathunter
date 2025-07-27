import { jwtDecode } from 'jwt-decode';

export function getTokenFromStorage() {
  return localStorage.getItem('token');
}

export function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function getUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
    role: decoded.role
  };
}