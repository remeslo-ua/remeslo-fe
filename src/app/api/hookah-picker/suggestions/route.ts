import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/mongodb';
import HookahSuggestion from '@/models/HookahSuggestion';
import HookahHistory from '@/models/HookahHistory';
import jwt from 'jsonwebtoken';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

// Helper to check rate limit
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count += 1;
  return true;
}

// Helper to generate preferences hash
function generatePreferencesHash(preferences: any): string {
  const normalizedPrefs = {
    tastes: preferences.tastes.sort(),
    zodiacSign: preferences.zodiacSign,
    moods: preferences.moods.sort(),
    intensity: preferences.intensity,
  };
  return JSON.stringify(normalizedPrefs);
}

// Helper to build detailed Gemini prompt
function buildPrompt(preferences: any): string {
  const { name, tastes, zodiacSign, moods, intensity } = preferences;
  
  let prompt = `You are an expert hookah (shisha) flavor consultant. Generate 3 unique and creative hookah flavor mix recommendations based on the following user preferences:\n\n`;
  
  if (name) {
    prompt += `User's Name: ${name}\n`;
  }
  
  if (tastes && tastes.length > 0) {
    prompt += `Flavor Preferences: ${tastes.join(', ')}\n`;
  }
  
  if (zodiacSign) {
    prompt += `Zodiac Sign: ${zodiacSign} (consider personality traits associated with this sign)\n`;
  }
  
  if (moods && moods.length > 0) {
    prompt += `Current Mood/Vibe: ${moods.join(', ')}\n`;
  }
  
  if (intensity) {
    prompt += `Preferred Intensity: ${intensity}\n`;
  }
  
  prompt += `\nPlease provide your response in the following JSON format (respond ONLY with valid JSON, no markdown or extra text):\n`;
  prompt += `{
  "suggestions": [
    {
      "name": "Creative mix name",
      "ingredients": ["flavor1", "flavor2", "flavor3"],
      "reasoning": "2-3 sentences explaining why this mix matches their preferences"
    }
  ],
  "analysis": "2-3 sentences providing an overall analysis of the user's preferences and flavor personality"
}\n\n`;
  
  prompt += `Make the recommendations creative, personalized, and well-reasoned. Consider how different flavors complement each other. Each mix should have 2-4 ingredients.`;
  
  return prompt;
}

// Helper to call Gemini with retry logic
async function callGeminiWithRetry(prompt: string): Promise<any> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
      
      throw new Error('Invalid JSON response from Gemini');
    } catch (error) {
      console.error(`Gemini API attempt ${attempt} failed:`, error);
      
      if (attempt === MAX_RETRIES) {
        throw new Error('Failed to generate suggestions after multiple attempts');
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

export async function POST(request: NextRequest) {
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

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const preferences = await request.json();

    // Validate that at least one preference is selected
    const hasPreference = 
      (preferences.name && preferences.name.trim()) ||
      (preferences.tastes && preferences.tastes.length > 0) ||
      preferences.zodiacSign ||
      (preferences.moods && preferences.moods.length > 0) ||
      preferences.intensity;

    if (!hasPreference) {
      return NextResponse.json(
        { error: 'Please select at least one preference' },
        { status: 400 }
      );
    }

    // Generate hash for preferences (excluding name for caching)
    const preferencesForHash = { ...preferences };
    delete preferencesForHash.name;
    const preferencesHash = generatePreferencesHash(preferencesForHash);

    // Check if we have cached suggestions for these preferences
    let suggestion = await HookahSuggestion.findOne({ preferencesHash });

    if (!suggestion) {
      // Generate new suggestions using Gemini
      const prompt = buildPrompt(preferences);
      const geminiResponse = await callGeminiWithRetry(prompt);

      // Create new suggestion document
      suggestion = await HookahSuggestion.create({
        preferencesHash,
        preferences: preferencesForHash,
        suggestions: geminiResponse.suggestions,
        analysis: geminiResponse.analysis,
      });
    }

    // Add to user's history
    await HookahHistory.create({
      userId,
      suggestionId: suggestion._id,
    });

    // Return suggestions with user's name if provided
    return NextResponse.json({
      suggestions: suggestion.suggestions,
      analysis: suggestion.analysis,
      userName: preferences.name,
    });

  } catch (error: any) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
