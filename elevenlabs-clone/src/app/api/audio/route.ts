import { NextResponse } from 'next/server';

// Mock database with audio URLs
const audioUrls = {
  english: 'https://example.com/english-audio.mp3',
  arabic: 'https://example.com/arabic-audio.mp3',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language');

  if (!language || !(language in audioUrls)) {
    return NextResponse.json(
      { error: 'Invalid or missing language parameter' },
      { status: 400 }
    );
  }

  // In a real app, you would fetch this from your database
  const audioUrl = audioUrls[language as keyof typeof audioUrls];

  return NextResponse.json({ url: audioUrl });
}
