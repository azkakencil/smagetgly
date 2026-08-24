import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid video id' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    if (!format?.url) {
      return NextResponse.json({ error: 'No audio stream available' }, { status: 404 });
    }

    // Redirect to YouTube's signed media URL. The browser's native <audio>
    // element then owns playback, allowing Media Session/background playback.
    return NextResponse.redirect(format.url, 302);
  } catch (error: any) {
    console.error('Audio extraction failed:', error?.message || error);
    return NextResponse.json(
      { error: 'Unable to extract audio stream', detail: error?.message || 'Unknown error' },
      { status: 502 }
    );
  }
}
