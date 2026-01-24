import { NextResponse } from 'next/server';

export async function POST() {
  // For JWT-based auth, logout is handled client-side by removing the token
  return NextResponse.json({ message: 'Logged out successfully' });
}