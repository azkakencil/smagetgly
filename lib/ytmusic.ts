import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();
let initPromise: Promise<any> | null = null;

export async function getYTMusic() {
  if (!initPromise) {
    initPromise = ytmusic.initialize().catch((err) => {
      initPromise = null;
      console.warn('YTMusic initialize error:', err?.message || err);
      return ytmusic;
    });
  }
  try {
    await initPromise;
  } catch (err) {
    console.warn('YTMusic init await error:', err);
  }
  return ytmusic;
}

/**
 * Safe search helpers with automatic ZodError and network fallback handling
 */
export async function safeSearch(query: string) {
  try {
    const api = await getYTMusic();
    const res = await api.search(query);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function safeSearchSongs(query: string) {
  try {
    const api = await getYTMusic();
    const res = await api.searchSongs(query);
    return Array.isArray(res) ? res : [];
  } catch {
    // Secondary fallback: try general search and filter songs
    try {
      const api = await getYTMusic();
      const res = await api.search(query);
      if (Array.isArray(res)) {
        const filtered = res.filter((item: any) => item.type === 'SONG' || item.type === 'VIDEO');
        if (filtered.length > 0) return filtered;
      }
    } catch {
      // ignore
    }
    return [];
  }
}

export async function safeSearchVideos(query: string) {
  try {
    const api = await getYTMusic();
    const res = await api.searchVideos(query);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function safeSearchArtists(query: string) {
  try {
    const api = await getYTMusic();
    const res = await api.searchArtists(query);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function safeSearchPlaylists(query: string) {
  try {
    const api = await getYTMusic();
    const res = await api.searchPlaylists(query);
    return Array.isArray(res) ? res.filter((p: any) => p.playlistId && !p.playlistId.startsWith('RD')) : [];
  } catch {
    return [];
  }
}

export async function safeSearchAlbums(query: string) {
  try {
    const api = await getYTMusic();
    const res = await api.searchAlbums(query);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function safeGetArtist(artistId: string) {
  if (!artistId || artistId.trim() === '') return null;
  try {
    const api = await getYTMusic();
    return await api.getArtist(artistId);
  } catch {
    return null;
  }
}

export async function safeGetAlbum(albumId: string) {
  if (!albumId || albumId.trim() === '') return null;
  // Albums in YTMusic must not start with PL
  if (albumId.startsWith('PL') || albumId.startsWith('VLPL')) return null;
  try {
    const api = await getYTMusic();
    return await api.getAlbum(albumId);
  } catch {
    return null;
  }
}

export async function safeGetPlaylist(playlistId: string) {
  if (!playlistId || playlistId.trim() === '') return null;
  try {
    const api = await getYTMusic();
    return await api.getPlaylist(playlistId);
  } catch {
    return null;
  }
}

export async function safeGetPlaylistVideos(playlistId: string) {
  if (!playlistId || playlistId.trim() === '') return [];
  try {
    const api = await getYTMusic();
    const res = await api.getPlaylistVideos(playlistId);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function safeGetUpNexts(videoId: string) {
  if (!videoId || videoId.trim() === '') return [];
  try {
    const api = await getYTMusic();
    const res = await api.getUpNexts(videoId);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}
