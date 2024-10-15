import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json();

    const apiKey = process.env.PLAY_HT_API_KEY!;
    const userId = process.env.PLAY_HT_USER_ID!;

    // Set up the Play.ht API URL and options
    const url = 'https://api.play.ht/api/v2/tts/stream';
    const options = {
      method: 'POST',
      headers: {
        accept: 'audio/mpeg',
        'content-type': 'application/json',
        AUTHORIZATION: `Bearer ${apiKey}`,
        'X-USER-ID': userId,
      },
      body: JSON.stringify({
        voice: voice,
        output_format: 'mp3',
        text: text,
        voice_engine: 'Play3.0-mini',
      }),
    };

    // Fetch the audio from the Play.ht API
    const apiRes = await fetch(url, options);
    const audioBlob = await apiRes.blob();

    // Convert the audio blob into an array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();

    // Return the audio data in the response
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error generating audio' }),
      { status: 500 }
    );
  }
}
