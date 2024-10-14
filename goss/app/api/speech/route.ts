import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the request body to get the text
    const { text } = await req.json();

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
        voice:
          // 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
          // 's3://voice-cloning-zero-shot/1afba232-fae0-4b69-9675-7f1aac69349f/delilahsaad/manifest.json',
          // 's3://voice-cloning-zero-shot/b2f5441d-354f-4c2f-8f32-390aaaabf42d/charlottesaad/manifest.json',
          // 's3://peregrine-voices/charlotte meditation 2 parrot saad/manifest.json',
          's3://voice-cloning-zero-shot/a59cb96d-bba8-4e24-81f2-e60b888a0275/charlottenarrativesaad/manifest.json',
        // 's3://voice-cloning-zero-shot/2879ab87-3775-4992-a228-7e4f551658c2/fredericksaad2/manifest.json',
        // 's3://voice-cloning-zero-shot/a5cc7dd9-069c-4fe8-9ae7-0c4bae4779c5/micahsaad/manifest.json',
        // 's3://voice-cloning-zero-shot/d99d35e6-e625-4fa4-925a-d65172d358e1/adriansaad/manifest.json',
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
