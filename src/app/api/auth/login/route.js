// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { setAuthCookie } from '@/lib/auth';
import { findUserByEmail } from '@/lib/data/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user in JSON file
    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    setAuthCookie(token);

    // Return user data (without password)
    return NextResponse.json({ 
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}