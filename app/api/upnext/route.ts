import { NextResponse } from 'next/server';
import { safeGetUpNexts, safeSearchSongs } from '@/lib/ytmusic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json([], { status: 200 });
  
  try {
    const upNext = await safeGetUpNexts(id);

    if (Array.isArray(upNext) && upNext.length > 0) {
      return NextResponse.json(upNext, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // Secondary fallback: search popular songs
    const fallbackSongs = await safeSearchSongs('top hits pop');
    return NextResponse.json(Array.isArray(fallbackSongs) ? fallbackSongs.slice(0, 10) : [], {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.warn(`UpNext error for id ${id}:`, error?.message || error);
    return NextResponse.json([], { status: 200 });
  }
}
