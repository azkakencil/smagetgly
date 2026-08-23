import { NextResponse } from 'next/server';
import { safeGetPlaylist, safeGetAlbum, safeGetPlaylistVideos, safeSearchSongs } from '@/lib/ytmusic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get('id');
  
  if (!rawId || rawId === 'undefined' || rawId === 'null') {
    return NextResponse.json({ error: 'Missing or invalid id', videos: [] }, { status: 200 });
  }

  try {
    const isAlbum = rawId.startsWith('MPREb_') || rawId.startsWith('OLAK');
    const isPlaylist = rawId.startsWith('PL') || rawId.startsWith('VLPL') || rawId.startsWith('RD');

    // 1. If it's an album ID
    if (isAlbum) {
      const albumCandidates = [rawId, rawId.startsWith('VL') ? rawId.slice(2) : `VL${rawId}`];
      for (const id of albumCandidates) {
        const album = (await safeGetAlbum(id)) as any;
        if (album && album.songs && album.songs.length > 0) {
          return NextResponse.json({
            playlistId: album.albumId || id,
            name: album.name || 'Album',
            artist: album.artist,
            thumbnails: album.thumbnails || [],
            videos: album.songs.map((song: any) => ({
              videoId: song.videoId,
              name: song.name,
              artist: song.artist || (album.artist ? [album.artist] : []),
              duration: song.duration,
              thumbnails: song.thumbnails || album.thumbnails || [],
            }))
          });
        }
      }
    }

    // 2. If it's a playlist or general candidate
    const playlistCandidates: string[] = [];
    if (rawId.startsWith('VL')) {
      playlistCandidates.push(rawId, rawId.slice(2));
    } else if (rawId.startsWith('PL') || rawId.startsWith('RD')) {
      playlistCandidates.push(rawId, `VL${rawId}`);
    } else {
      playlistCandidates.push(rawId);
    }

    for (const id of playlistCandidates) {
      const playlist = (await safeGetPlaylist(id)) as any;
      if (playlist) {
        let videos = playlist.videos || [];
        if (!videos || videos.length === 0) {
          videos = await safeGetPlaylistVideos(id);
        }
        if (videos && videos.length > 0) {
          return NextResponse.json({
            playlistId: playlist.playlistId || id,
            name: playlist.name || 'Playlist',
            artist: playlist.artist,
            thumbnails: playlist.thumbnails || [],
            videos: videos
          });
        }
      }

      const videos = await safeGetPlaylistVideos(id);
      if (videos && videos.length > 0) {
        return NextResponse.json({
          playlistId: id,
          name: 'Playlist',
          thumbnails: videos[0]?.thumbnails || [],
          videos: videos
        });
      }
    }

    // 3. Fallback: Search songs if it's a topic, query name, or unresolvable ID
    const query = rawId.replace(/[-_]/g, ' ');
    const fallbackSongs = await safeSearchSongs(query.length > 3 ? query : 'top hits indonesia');
    if (fallbackSongs && fallbackSongs.length > 0) {
      return NextResponse.json({
        playlistId: rawId,
        name: query.length > 3 ? query.charAt(0).toUpperCase() + query.slice(1) : 'Koleksi Musik',
        thumbnails: fallbackSongs[0]?.thumbnails || [],
        videos: fallbackSongs.slice(0, 20)
      });
    }

    // Return empty payload gracefully
    return NextResponse.json({
      playlistId: rawId,
      name: 'Playlist',
      thumbnails: [],
      videos: []
    });
  } catch {
    return NextResponse.json({
      playlistId: rawId,
      name: 'Playlist',
      thumbnails: [],
      videos: []
    });
  }
}
