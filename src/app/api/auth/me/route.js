// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAuthCookie } from '@/lib/auth';
import { findUserByEmail } from '@/lib/userDB';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export async function GET() {
  try {
    // Get token from cookie
    const token = getAuthCookie();
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Find user in JSON file
    const user = findUserByEmail(decoded.email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data (without password)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}