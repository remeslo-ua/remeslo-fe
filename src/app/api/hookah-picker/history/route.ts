import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HookahHistory from '@/models/HookahHistory';
import HookahSuggestion from '@/models/HookahSuggestion';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user from token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch user's history with populated suggestions
    const history = await HookahHistory.find({ userId })
      .sort({ createdAt: -1 })
      .populate('suggestionId')
      .lean();

    // Format the response
    const formattedHistory = history.map((item: any) => ({
      id: item._id,
      createdAt: item.createdAt,
      preferences: item.suggestionId.preferences,
      suggestions: item.suggestionId.suggestions,
      analysis: item.suggestionId.analysis,
    }));

    return NextResponse.json({ history: formattedHistory });

  } catch (error: any) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
