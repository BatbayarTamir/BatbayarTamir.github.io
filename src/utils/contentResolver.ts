import { SanctuaryData, Song, GirlfriendSiteConfig, PolaroidMemory, Milestone, LoveCoupon } from '../types';

/**
 * Resolves and fetches the live JSON configuration from GitHub (`public/content.json` and `public/playlist.json`).
 * Uses cache-busting to ensure any update pushed to the GitHub repository is immediately loaded
 * on every visiting device (phones, computers, tablets) without getting stuck on stale browser caches.
 */
export async function fetchPublishedContentManifest(): Promise<SanctuaryData | null> {
  const cacheBuster = `t=${Date.now()}`;
  const candidateUrls = [
    `./content.json?${cacheBuster}`,
    `./public/content.json?${cacheBuster}`,
    `https://raw.githubusercontent.com/BatbayarTamir/BatbayarTamir.github.io/main/public/content.json?${cacheBuster}`,
  ];

  let loadedData: SanctuaryData | null = null;

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === 'object') {
          loadedData = json as SanctuaryData;
          break;
        }
      }
    } catch {
      // Continue to next fallback
    }
  }

  // Also check if playlist.json was updated separately in public/playlist.json
  const playlistUrls = [
    `./playlist.json?${cacheBuster}`,
    `./public/playlist.json?${cacheBuster}`,
    `https://raw.githubusercontent.com/BatbayarTamir/BatbayarTamir.github.io/main/public/playlist.json?${cacheBuster}`,
  ];

  for (const pUrl of playlistUrls) {
    try {
      const pRes = await fetch(pUrl, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (pRes.ok) {
        const pJson = await pRes.json();
        if (Array.isArray(pJson) && pJson.length > 0) {
          if (!loadedData) {
            loadedData = { playlist: pJson as Song[] };
          } else if (!loadedData.playlist || loadedData.playlist.length === 0) {
            loadedData.playlist = pJson as Song[];
          } else {
            // Merge playlist with higher specificity if audioUrl or songs are defined
            loadedData.playlist = pJson as Song[];
          }
          break;
        }
      }
    } catch {
      // Continue
    }
  }

  return loadedData;
}

/**
 * Generate formatted JSON for content.json
 */
export function generateContentJson(
  config: GirlfriendSiteConfig,
  playlist: Song[],
  memories: PolaroidMemory[],
  milestones: Milestone[],
  reasons: string[],
  coupons: LoveCoupon[]
): string {
  // Clean up any local blob URLs before exporting
  const cleanPlaylist = playlist.map((s) => ({
    ...s,
    audioUrl: s.audioUrl && s.audioUrl.startsWith('blob:') ? `./audio/${s.id}.mp3` : s.audioUrl,
    isCustomUpload: undefined,
  }));

  const cleanMemories = memories.map((m) => ({
    ...m,
    imageUrl: m.imageUrl && m.imageUrl.startsWith('blob:') ? `./images/${m.id}.jpg` : m.imageUrl,
  }));

  const data: SanctuaryData = {
    config,
    playlist: cleanPlaylist,
    memories: cleanMemories,
    milestones,
    reasons,
    coupons,
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Generate formatted JSON for playlist.json
 */
export function generatePlaylistJson(playlist: Song[]): string {
  const cleanPlaylist = playlist.map((s) => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    duration: s.duration,
    dedication: s.dedication,
    tone: s.tone,
    lyricsSnippet: s.lyricsSnippet,
    accentColor: s.accentColor,
    audioUrl: s.audioUrl && s.audioUrl.startsWith('blob:') ? `./audio/${s.id}.mp3` : s.audioUrl,
  }));

  return JSON.stringify(cleanPlaylist, null, 2);
}
