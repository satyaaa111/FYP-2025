// src/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/data/db';

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    // Check if user already exists
    if (findUserByEmail(email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password, // In production, hash this with bcrypt!
      name: name || email.split('@')[0],
      role: role || 'buyer'
    };

    const savedUser = createUser(newUser);
    if (!savedUser) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'User created successfully. Please log in to continue.',
      success: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}