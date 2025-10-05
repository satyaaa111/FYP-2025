// src/lib/auth.js
import { cookies } from 'next/headers';

export function setAuthCookie(token) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    sameSite: 'strict'
  });
}

export function getAuthCookie() {
  return cookies().get('token')?.value;
}

export function clearAuthCookie() {
  cookies().set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/'
  });
}