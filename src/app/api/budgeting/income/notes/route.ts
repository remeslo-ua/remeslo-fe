import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Income from '@/models/Income';
import { getUserFromToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = getUserFromToken(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get unique descriptions for the user
    const notes = await Income.distinct('description', { userId: authUser.userId });

    return NextResponse.json({
      notes: notes.filter(note => note && note.trim() !== ''),
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}