import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import FormData from 'form-data';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: 'Audio file is required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const whisperFormData = new FormData();
    whisperFormData.append('file', buffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });
    whisperFormData.append('model', 'whisper-1');

    const headers = whisperFormData.getHeaders();

    const transcriptionResponse = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      whisperFormData,
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const transcriptionText = transcriptionResponse.data.text;

    return NextResponse.json(
      { transcription: transcriptionText },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Transcription failed' },
      { status: 500 }
    );
  }
}
